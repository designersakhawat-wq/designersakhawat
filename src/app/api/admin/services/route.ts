import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { query, execute, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

/** GET /api/admin/services */
export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    const services = await query(`
      SELECT s.*, m.storage_path, m.thumb_path, m.medium_path, m.alt_text, m.width, m.height
      FROM services s
      LEFT JOIN media m ON s.cover_media_id = m.id
      WHERE s.deleted_at IS NULL
      ORDER BY s.display_order ASC, s.created_at ASC
    `);
    return NextResponse.json({ services });
  });
}

/** POST /api/admin/services */
export async function POST(req: NextRequest) {
  return requireAdmin(req, async (_req, session) => {
    const body = await req.json();
    const { name, slug, description, cover_media_id, pricing_mode, display_order, visible } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required." }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await queryOne("SELECT id FROM services WHERE slug = ? AND deleted_at IS NULL", [slug]);
    if (existing) {
      return NextResponse.json({ error: "A service with this slug already exists." }, { status: 409 });
    }

    const result = await execute(
      `INSERT INTO services (name, slug, description, cover_media_id, pricing_mode, display_order, visible)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description || null, cover_media_id || null, pricing_mode || "quote_only", display_order || 0, visible !== false ? 1 : 0]
    );

    await execute(
      "INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
      ["service_created", "service", result.insertId, `Created service: ${name}`]
    );

    revalidatePath("/");
    revalidatePath("/services");

    return NextResponse.json({ success: true, id: result.insertId });
  });
}

/** PATCH /api/admin/services — reorder */
export async function PATCH(req: NextRequest) {
  return requireAdmin(req, async () => {
    const { order } = await req.json();
    // order: [{ id, display_order }, ...]
    for (const item of order) {
      await execute("UPDATE services SET display_order = ? WHERE id = ?", [item.display_order, item.id]);
    }
    revalidatePath("/");
    revalidatePath("/services");
    return NextResponse.json({ success: true });
  });
}
