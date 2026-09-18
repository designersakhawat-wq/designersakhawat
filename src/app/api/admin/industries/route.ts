import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { query, execute } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    const industries = await query(
      "SELECT * FROM industries ORDER BY display_order ASC, created_at ASC"
    );
    return NextResponse.json({ industries });
  });
}

export async function POST(req: NextRequest) {
  return requireAdmin(req, async () => {
    const { name, icon, display_order, visible } = await req.json();
    if (!name) return NextResponse.json({ error: "Name required." }, { status: 400 });
    const result = await execute(
      "INSERT INTO industries (name, icon, display_order, visible) VALUES (?, ?, ?, ?)",
      [name, icon || null, display_order || 0, visible !== false ? 1 : 0]
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
        await execute("UPDATE industries SET display_order = ? WHERE id = ?", [item.display_order, item.id]);
      }
    } else if (body.id) {
      const { id, name, icon, display_order, visible } = body;
      await execute(
        "UPDATE industries SET name=?, icon=?, display_order=?, visible=? WHERE id=?",
        [name, icon || null, display_order || 0, visible ? 1 : 0, id]
      );
    }
    revalidatePath("/");
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: NextRequest) {
  return requireAdmin(req, async () => {
    const { id } = await req.json();
    await execute("DELETE FROM industries WHERE id = ?", [id]);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  });
}
