import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { query, execute, queryOne } from "@/lib/db";
import { revalidatePath } from "next/cache";

/** GET /api/admin/settings */
export async function GET(req: NextRequest) {
  return requireAdmin(req, async () => {
    const rows = await query<{ key: string; value: string }>(
      "SELECT `key`, value FROM settings ORDER BY `key` ASC"
    );
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value ?? "";
    }
    return NextResponse.json({ settings });
  });
}

/** POST /api/admin/settings */
export async function POST(req: NextRequest) {
  return requireAdmin(req, async () => {
    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Settings object required." }, { status: 400 });
    }

    for (const [key, value] of Object.entries(settings)) {
      await execute(
        "INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)",
        [key, String(value)]
      );
    }

    await execute(
      "INSERT INTO activity_log (action, entity_type, detail) VALUES (?, ?, ?)",
      ["settings_updated", "settings", `Updated ${Object.keys(settings).length} settings`]
    );

    // Revalidate all affected pages
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");

    return NextResponse.json({ success: true });
  });
}
