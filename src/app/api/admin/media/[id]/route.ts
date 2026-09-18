import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { execute, queryOne, query } from "@/lib/db";
import path from "path";
import fs from "fs/promises";

type Params = { params: Promise<{ id: string }> };

/** PATCH /api/admin/media/[id] — update alt text / focal point */
export async function PATCH(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const body = await req.json();
    const { alt_text, focal_x, focal_y } = body;

    await execute(
      "UPDATE media SET alt_text = ?, focal_x = ?, focal_y = ? WHERE id = ?",
      [alt_text ?? null, focal_x ?? 0.5, focal_y ?? 0.5, id]
    );

    return NextResponse.json({ success: true });
  });
}

/** DELETE /api/admin/media/[id] */
export async function DELETE(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;

    // Check if referenced by published content
    const inUsePublished = await query<{ count: number }>(
      `SELECT 
        (SELECT COUNT(*) FROM projects WHERE (cover_media_id = ? OR og_image_id = ?) AND status = 'published') +
        (SELECT COUNT(*) FROM services WHERE cover_media_id = ? AND deleted_at IS NULL AND visible = 1)
       AS count`,
      [id, id, id]
    );

    const count = (inUsePublished[0] as { count: number })?.count ?? 0;
    if (count > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete: this media is used by published content. Remove it from all published items first.",
        },
        { status: 409 }
      );
    }

    // Get file paths
    const media = await queryOne<{
      storage_path: string;
      thumb_path: string | null;
      medium_path: string | null;
      webp_path: string | null;
    }>("SELECT storage_path, thumb_path, medium_path, webp_path FROM media WHERE id = ?", [id]);

    if (!media) {
      return NextResponse.json({ error: "Media not found." }, { status: 404 });
    }

    // Delete DB record first
    await execute("DELETE FROM media WHERE id = ?", [id]);

    // Delete files (best-effort)
    const filesToDelete = [
      media.storage_path,
      media.thumb_path,
      media.medium_path,
    ].filter(Boolean) as string[];

    // Deduplicate webp_path if same as storage_path
    const uniqueFiles = [...new Set(filesToDelete)];

    for (const filePath of uniqueFiles) {
      try {
        await fs.unlink(filePath);
      } catch {
        // File may not exist — not fatal
      }
    }

    await execute(
      "INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
      ["media_deleted", "media", parseInt(id), "Deleted media file"]
    );

    return NextResponse.json({ success: true });
  });
}

/** GET /api/admin/media/[id] */
export async function GET(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const media = await queryOne("SELECT * FROM media WHERE id = ?", [id]);
    if (!media) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ media });
  });
}
