import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { query, execute } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    const clients = await query(`
      SELECT cl.*, m.storage_path, m.thumb_path, m.alt_text
      FROM client_logos cl
      LEFT JOIN media m ON cl.media_id = m.id
      WHERE cl.deleted_at IS NULL
      ORDER BY cl.display_order ASC, cl.created_at ASC
    `);
    return NextResponse.json({ clients });
  });
}

export async function POST(req: NextRequest) {
  return requireAdmin(req, async () => {
    const body = await req.json();
    const { name, media_id, website_url, display_order, visible } = body;
    if (!name) return NextResponse.json({ error: "Client name required." }, { status: 400 });
    const result = await execute(
      "INSERT INTO client_logos (name, media_id, website_url, display_order, visible) VALUES (?, ?, ?, ?, ?)",
      [name, media_id || null, website_url || null, display_order || 0, visible !== false ? 1 : 0]
    );
    revalidatePath("/");
    return NextResponse.json({ success: true, id: result.insertId });
  });
}

export async function PATCH(req: NextRequest) {
  return requireAdmin(req, async () => {
    const body = await req.json();
    if (body.order) {
      for (const item of body.order) {
        await execute("UPDATE client_logos SET display_order = ? WHERE id = ?", [item.display_order, item.id]);
      }
    } else if (body.id) {
      const { id, name, media_id, website_url, display_order, visible, action } = body;
      if (action === "trash") {
        await execute("UPDATE client_logos SET deleted_at = NOW(), visible = 0 WHERE id = ?", [id]);
      } else if (action === "restore") {
        await execute("UPDATE client_logos SET deleted_at = NULL WHERE id = ?", [id]);
      } else {
        await execute(
          "UPDATE client_logos SET name=?, media_id=?, website_url=?, display_order=?, visible=? WHERE id=?",
          [name, media_id || null, website_url || null, display_order || 0, visible ? 1 : 0, id]
        );
      }
    }
    revalidatePath("/");
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: NextRequest) {
  return requireAdmin(req, async () => {
    const { id } = await req.json();
    await execute("DELETE FROM client_logos WHERE id = ?", [id]);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  });
}
