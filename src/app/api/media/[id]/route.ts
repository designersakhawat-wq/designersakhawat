import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { queryOne } from "@/lib/db";

/** GET /api/media/[id] — serve media files */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const size = url.searchParams.get("size") as "thumb" | "medium" | "original" | null;

  const media = await queryOne<{
    storage_path: string;
    thumb_path: string | null;
    medium_path: string | null;
    mime_type: string;
    alt_text: string | null;
  }>("SELECT storage_path, thumb_path, medium_path, mime_type, alt_text FROM media WHERE id = ?", [id]);

  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  let filePath: string;
  if (size === "thumb" && media.thumb_path) {
    filePath = media.thumb_path;
  } else if (size === "medium" && media.medium_path) {
    filePath = media.medium_path;
  } else {
    filePath = media.storage_path;
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    // Determine content type from stored path extension
    let contentType = media.mime_type;
    if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".avif") contentType = "image/avif";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
