import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { query, execute, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

/** GET /api/admin/projects */
export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // draft|published|trashed

    let whereClause = "WHERE 1=1";
    const params: unknown[] = [];

    if (status) {
      whereClause += " AND p.status = ?";
      params.push(status);
    } else {
      whereClause += " AND p.status != 'trashed'";
    }

    const projects = await query(
      `SELECT p.*, 
        s.name as service_name, s.slug as service_slug,
        m.storage_path as cover_path, m.thumb_path as cover_thumb
       FROM projects p
       LEFT JOIN services s ON p.service_id = s.id
       LEFT JOIN media m ON p.cover_media_id = m.id
       ${whereClause}
       ORDER BY p.display_order ASC, p.updated_at DESC`,
      params
    );

    return NextResponse.json({ projects });
  });
}

/** POST /api/admin/projects */
export async function POST(req: NextRequest) {
  return requireAdmin(req, async () => {
    const body = await req.json();
    const {
      title, slug, cover_media_id, video_url, service_id, client, industry,
      short_description, challenge, solution, result, services_provided,
      featured, display_order, status, seo_title, seo_description, og_image_id
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
    }

    const existing = await queryOne("SELECT id FROM projects WHERE slug = ?", [slug]);
    if (existing) {
      return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
    }

    const insertStatus = status || "draft";
    const publishedAt = insertStatus === "published" ? new Date().toISOString().slice(0, 19).replace("T", " ") : null;

    const insertResult = await execute(
      `INSERT INTO projects (title, slug, cover_media_id, video_url, service_id, client, industry, short_description, challenge, solution, result, services_provided, featured, display_order, status, seo_title, seo_description, og_image_id, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, cover_media_id || null, video_url || null, service_id || null, client || null, industry || null, short_description || null, challenge || null, solution || null, result || null, services_provided || null, featured ? 1 : 0, display_order || 0, insertStatus, seo_title || null, seo_description || null, og_image_id || null, publishedAt]
    );

    await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
      ["project_created", "project", insertResult.insertId, `Created project: ${title}`]);

    if (insertStatus === "published") {
      revalidatePath("/");
      revalidatePath("/portfolio");
      revalidatePath(`/portfolio/${slug}`);
    }

    return NextResponse.json({ success: true, id: insertResult.insertId });
  });
}

/** PATCH /api/admin/projects — reorder */
export async function PATCH(req: NextRequest) {
  return requireAdmin(req, async () => {
    const { order } = await req.json();
    for (const item of order) {
      await execute("UPDATE projects SET display_order = ? WHERE id = ?", [item.display_order, item.id]);
    }
    revalidatePath("/portfolio");
    return NextResponse.json({ success: true });
  });
}
