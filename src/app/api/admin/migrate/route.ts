import { NextResponse } from "next/server";
import { migrate, seed } from "@/lib/db/migrate";

/** GET /api/admin/migrate — run migrations (dev only, remove before production) */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }
  try {
    await migrate();
    await seed();
    return NextResponse.json({ success: true, message: "Migrations and seed complete." });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
