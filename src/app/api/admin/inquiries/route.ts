import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { query, execute } from "@/lib/db";

export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = 20;
    const offset = (page - 1) * limit;
    const unread = url.searchParams.get("unread") === "true";

    const where = unread ? "WHERE read_at IS NULL" : "";
    const inquiries = await query(
      `SELECT * FROM inquiries ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const total = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM inquiries ${where}`
    );
    const unreadCount = await query<{ count: number }>(
      "SELECT COUNT(*) as count FROM inquiries WHERE read_at IS NULL"
    );

    return NextResponse.json({
      inquiries,
      total: total[0]?.count ?? 0,
      unreadCount: unreadCount[0]?.count ?? 0,
      page,
    });
  });
}

export async function PATCH(req: NextRequest) {
  return requireAdmin(req, async () => {
    const { id, action } = await req.json();
    if (action === "read") {
      await execute("UPDATE inquiries SET read_at = NOW() WHERE id = ? AND read_at IS NULL", [id]);
    } else if (action === "unread") {
      await execute("UPDATE inquiries SET read_at = NULL WHERE id = ?", [id]);
    }
    return NextResponse.json({ success: true });
  });
}

export async function DELETE(req: NextRequest) {
  return requireAdmin(req, async () => {
    const { id } = await req.json();
    await execute("DELETE FROM inquiries WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  });
}
