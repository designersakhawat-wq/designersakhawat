import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { query, execute, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    const testimonials = await query(`
      SELECT t.*, m.storage_path, m.thumb_path, m.alt_text
      FROM testimonials t
      LEFT JOIN media m ON t.photo_media_id = m.id
      WHERE t.deleted_at IS NULL
      ORDER BY t.display_order ASC, t.created_at ASC
    `);
    return NextResponse.json({ testimonials });
  });
}

export async function POST(req: NextRequest) {
  return requireAdmin(req, async () => {
    const body = await req.json();
    const { client_name, designation, company, photo_media_id, text, display_order, visible } = body;

    if (!client_name || !text) {
      return NextResponse.json({ error: "Client name and testimonial text are required." }, { status: 400 });
    }

    const result = await execute(
      `INSERT INTO testimonials (client_name, designation, company, photo_media_id, text, display_order, visible)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [client_name, designation || null, company || null, photo_media_id || null, text, display_order || 0, visible !== false ? 1 : 0]
    );

    await execute("INSERT INTO activity_log (action, entity_type, entity_id, detail) VALUES (?, ?, ?, ?)",
      ["testimonial_created", "testimonial", result.insertId, `Created testimonial from ${client_name}`]);

    revalidatePath("/");
    return NextResponse.json({ success: true, id: result.insertId });
  });
}

export async function PATCH(req: NextRequest) {
  return requireAdmin(req, async () => {
    const body = await req.json();
    if (body.id && body.action !== "reorder") {
      // Update single
      const { id, client_name, designation, company, photo_media_id, text, display_order, visible, action } = body;
      if (action === "trash") {
        await execute("UPDATE testimonials SET deleted_at = NOW(), visible = 0 WHERE id = ?", [id]);
      } else if (action === "restore") {
        await execute("UPDATE testimonials SET deleted_at = NULL WHERE id = ?", [id]);
      } else {
        await execute(
          "UPDATE testimonials SET client_name=?, designation=?, company=?, photo_media_id=?, text=?, display_order=?, visible=? WHERE id=?",
          [client_name, designation || null, company || null, photo_media_id || null, text, display_order || 0, visible ? 1 : 0, id]
        );
      }
    } else if (body.order) {
      for (const item of body.order) {
        await execute("UPDATE testimonials SET display_order = ? WHERE id = ?", [item.display_order, item.id]);
      }
    }
    revalidatePath("/");
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: NextRequest) {
  return requireAdmin(req, async () => {
    const { id } = await req.json();
    await execute("DELETE FROM testimonials WHERE id = ?", [id]);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  });
}
