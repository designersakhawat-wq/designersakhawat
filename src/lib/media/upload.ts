import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { execute } from "@/lib/db";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/mov",
  "video/quicktime",
]);

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

const MAX_SIZE_BYTES = parseInt(process.env.MAX_UPLOAD_MB || "50") * 1024 * 1024;

/** Magic bytes for file type validation */
const MAGIC_BYTES: Array<{ mime: string; bytes: number[]; offset?: number }> = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 },
  { mime: "video/mp4", bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
];

function getUploadDir(): string {
  const dir = process.env.UPLOAD_DIR || "./uploads";
  return path.resolve(process.cwd(), dir);
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 100);
}

function validateMagicBytes(buffer: Buffer, mime: string): boolean {
  // For known types, verify magic bytes
  for (const magic of MAGIC_BYTES) {
    if (magic.mime === mime) {
      const offset = magic.offset ?? 0;
      for (let i = 0; i < magic.bytes.length; i++) {
        if (buffer[offset + i] !== magic.bytes[i]) return false;
      }
      return true;
    }
  }
  // Unknown type - allow if in allowlist
  return ALLOWED_MIME_TYPES.has(mime);
}

export interface UploadResult {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  storagePath: string;
  thumbPath: string | null;
  mediumPath: string | null;
  webpPath: string | null;
  url: string;
  thumbUrl: string | null;
  mediumUrl: string | null;
}

export async function processUpload(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<UploadResult> {
  // Validate size
  if (buffer.length > MAX_SIZE_BYTES) {
    throw new Error(`File too large. Maximum size is ${process.env.MAX_UPLOAD_MB || 50}MB.`);
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(`File type not allowed: ${mimeType}`);
  }

  // Validate magic bytes
  if (!validateMagicBytes(buffer, mimeType)) {
    throw new Error("File content does not match declared type.");
  }

  const uploadDir = getUploadDir();
  const id = nanoid(12);
  const ext = path.extname(originalName).toLowerCase() || ".bin";
  const safeName = sanitizeFilename(path.basename(originalName, ext));
  const filename = `${id}_${safeName}`;

  await ensureDir(uploadDir);

  let width: number | null = null;
  let height: number | null = null;
  let storagePath: string;
  let thumbPath: string | null = null;
  let mediumPath: string | null = null;
  let webpPath: string | null = null;

  if (IMAGE_MIME_TYPES.has(mimeType)) {
    // Process image with Sharp
    const sharpInstance = sharp(buffer, { failOn: "none" });
    const metadata = await sharpInstance.metadata();
    width = metadata.width ?? null;
    height = metadata.height ?? null;

    // Original (compressed, max 2400px)
    const originalFile = `${filename}_original.webp`;
    storagePath = path.join(uploadDir, originalFile);
    await sharp(buffer)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(storagePath);

    // Medium (1200px wide, WebP)
    const mediumFile = `${filename}_medium.webp`;
    mediumPath = path.join(uploadDir, mediumFile);
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(mediumPath);

    // Thumbnail (400×300 cover crop, WebP)
    const thumbFile = `${filename}_thumb.webp`;
    thumbPath = path.join(uploadDir, thumbFile);
    await sharp(buffer)
      .resize({ width: 400, height: 300, fit: "cover" })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    webpPath = storagePath; // already WebP
  } else {
    // Video - store as-is
    const videoFile = `${filename}${ext}`;
    storagePath = path.join(uploadDir, videoFile);
    await fs.writeFile(storagePath, buffer);
  }

  // Store metadata in DB
  const result = await execute(
    `INSERT INTO media (filename, original_name, mime_type, size, width, height, storage_path, thumb_path, medium_path, webp_path)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      path.basename(storagePath),
      originalName,
      mimeType,
      buffer.length,
      width,
      height,
      storagePath,
      thumbPath,
      mediumPath,
      webpPath,
    ]
  );

  const mediaId = result.insertId;

  return {
    id: mediaId,
    filename: path.basename(storagePath),
    originalName,
    mimeType,
    size: buffer.length,
    width,
    height,
    storagePath,
    thumbPath,
    mediumPath,
    webpPath,
    url: `/api/media/${mediaId}`,
    thumbUrl: thumbPath ? `/api/media/${mediaId}?size=thumb` : null,
    mediumUrl: mediumPath ? `/api/media/${mediaId}?size=medium` : null,
  };
}

export function getMediaUrl(mediaId: number, size?: "thumb" | "medium" | "original"): string {
  if (size && size !== "original") {
    return `/api/media/${mediaId}?size=${size}`;
  }
  return `/api/media/${mediaId}`;
}
