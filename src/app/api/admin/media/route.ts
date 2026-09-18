import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { processUpload } from "@/lib/media/upload";
import { query, execute } from "@/lib/db";

/** GET /api/admin/media — list all media */
export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "48");
    const offset = (page - 1) * limit;
    const type = url.searchParams.get("type"); // 'image' | 'video' | null

    let whereClause = "";
    const params: unknown[] = [];

    if (type === "image") {
      whereClause = "WHERE mime_type LIKE 'image/%'";
    } else if (type === "video") {
      whereClause = "WHERE mime_type LIKE 'video/%'";
    }

    const [media, total] = await Promise.all([
      query(
        `SELECT * FROM media ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      ),
      query<{ count: number }>(
        `SELECT COUNT(*) as count FROM media ${whereClause}`,
        params
      ),
    ]);

    // Add usage count to each media item
    const mediaWithUsage = await Promise.all(
      media.map(async (m: { id: number }) => {
        const usages = await query<{ count: number }>(
          `SELECT 
            (SELECT COUNT(*) FROM projects WHERE cover_media_id = ? OR og_image_id = ?) +
            (SELECT COUNT(*) FROM project_media WHERE media_id = ?) +
            (SELECT COUNT(*) FROM services WHERE cover_media_id = ?) +
            (SELECT COUNT(*) FROM testimonials WHERE photo_media_id = ?) +
            (SELECT COUNT(*) FROM client_logos WHERE media_id = ?)
           AS count`,
          [m.id, m.id, m.id, m.id, m.id, m.id]
        );
        return { ...m, usage_count: usages[0]?.count ?? 0 };
      })
    );

    return NextResponse.json({
      media: mediaWithUsage,
      total: total[0]?.count ?? 0,
      page,
      limit,
    });
  });
}

/** POST /api/admin/media — upload file */
export async function POST(req: NextRequest) {
  return requireAdmin(req, async () => {
    try {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await processUpload(buffer, file.name, file.type);

      await execute(
        "INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
        ["media_uploaded", "media", result.id, `Uploaded: ${file.name}`]
      );

      return NextResponse.json({ success: true, media: result });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  });
}
