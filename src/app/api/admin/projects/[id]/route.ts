import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { execute, queryOne, query } from "@/lib/db";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const project = await queryOne(`
      SELECT p.*, 
        s.name as service_name,
        m.storage_path as cover_path, m.thumb_path as cover_thumb, m.alt_text as cover_alt
      FROM projects p
      LEFT JOIN services s ON p.service_id = s.id
      LEFT JOIN media m ON p.cover_media_id = m.id
      WHERE p.id = ?
    `, [id]);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const media = await query(`
      SELECT pm.*, 
        m.storage_path, m.thumb_path, m.medium_path, m.alt_text, m.mime_type, m.width, m.height,
        poster.storage_path as poster_path, poster.thumb_path as poster_thumb
      FROM project_media pm
      LEFT JOIN media m ON pm.media_id = m.id
      LEFT JOIN media poster ON pm.poster_id = poster.id
      WHERE pm.project_id = ?
      ORDER BY pm.display_order ASC
    `, [id]);

    return NextResponse.json({ project, media });
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const body = await req.json();
    const {
      title, slug, cover_media_id, video_url, service_id, client, industry,
      short_description, challenge, solution, result, services_provided,
      featured, display_order, seo_title, seo_description, og_image_id
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required." }, { status: 400 });
    }

    const duplicate = await queryOne("SELECT id FROM projects WHERE slug = ? AND id != ?", [slug, id]);
    if (duplicate) {
      return NextResponse.json({ error: "Slug already in use." }, { status: 409 });
    }

    await execute(
      `UPDATE projects SET title=?, slug=?, cover_media_id=?, video_url=?, service_id=?, client=?, industry=?, short_description=?, challenge=?, solution=?, result=?, services_provided=?, featured=?, display_order=?, seo_title=?, seo_description=?, og_image_id=? WHERE id=?`,
      [title, slug, cover_media_id || null, video_url || null, service_id || null, client || null, industry || null, short_description || null, challenge || null, solution || null, result || null, services_provided || null, featured ? 1 : 0, display_order || 0, seo_title || null, seo_description || null, og_image_id || null, id]
    );

    await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
      ["project_updated", "project", parseInt(id), `Updated project: ${title}`]);

    // Revalidate
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const body = await req.json();

    // Publish / Unpublish / Trash / Restore
    if (body.action === "publish") {
      await execute(
        "UPDATE projects SET status='published', published_at=NOW() WHERE id=?", [id]
      );
      const p = await queryOne<{ slug: string; service_id: number | null }>("SELECT slug, service_id FROM projects WHERE id=?", [id]);
      if (p) {
        revalidatePath("/portfolio");
        revalidatePath(`/portfolio/${p.slug}`);
        revalidatePath("/");
        if (p.service_id) revalidatePath(`/services`);
      }
      await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
        ["project_published", "project", parseInt(id), "Published project"]);
      return NextResponse.json({ success: true });
    }

    if (body.action === "unpublish") {
      await execute("UPDATE projects SET status='draft' WHERE id=?", [id]);
      const p = await queryOne<{ slug: string }>("SELECT slug FROM projects WHERE id=?", [id]);
      if (p) {
        revalidatePath("/portfolio");
        revalidatePath(`/portfolio/${p.slug}`);
        revalidatePath("/");
      }
      await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
        ["project_unpublished", "project", parseInt(id), "Unpublished project"]);
      return NextResponse.json({ success: true });
    }

    if (body.action === "trash") {
      await execute("UPDATE projects SET status='trashed', deleted_at=NOW() WHERE id=?", [id]);
      const p = await queryOne<{ slug: string }>("SELECT slug FROM projects WHERE id=?", [id]);
      if (p) {
        revalidatePath("/portfolio");
        revalidatePath(`/portfolio/${p.slug}`);
        revalidatePath("/");
      }
      await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
        ["project_trashed", "project", parseInt(id), "Moved project to trash"]);
      return NextResponse.json({ success: true });
    }

    if (body.action === "restore") {
      await execute("UPDATE projects SET status='draft', deleted_at=NULL WHERE id=?", [id]);
      await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
        ["project_restored", "project", parseInt(id), "Restored project from trash"]);
      return NextResponse.json({ success: true });
    }

    // Update media gallery
    if (body.media !== undefined) {
      // Remove all existing media items and re-insert
      await execute("DELETE FROM project_media WHERE project_id = ?", [id]);
      
      for (let i = 0; i < body.media.length; i++) {
        const item = body.media[i];
        await execute(
          `INSERT INTO project_media (project_id, media_id, video_url, video_type, poster_id, display_order, type) VALUES (?,?,?,?,?,?,?)`,
          [id, item.media_id || null, item.video_url || null, item.video_type || null, item.poster_id || null, i, item.type || "image"]
        );
      }

      revalidatePath(`/portfolio`);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  return requireAdmin(req, async () => {
    const { id } = await params;
    const p = await queryOne<{ slug: string }>("SELECT slug FROM projects WHERE id=?", [id]);
    
    await execute("DELETE FROM project_media WHERE project_id = ?", [id]);
    await execute("DELETE FROM projects WHERE id = ?", [id]);
    
    if (p) {
      revalidatePath("/portfolio");
      revalidatePath(`/portfolio/${p.slug}`);
      revalidatePath("/");
    }

    await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
      ["project_deleted", "project", parseInt(id), "Permanently deleted project"]);

    return NextResponse.json({ success: true });
  });
}
