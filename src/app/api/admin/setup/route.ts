import { NextRequest, NextResponse } from "next/server";
import { migrate, seed } from "@/lib/db/migrate";
import bcrypt from "bcryptjs";
import { execute, queryOne } from "@/lib/db";

/**
 * One-time admin setup endpoint.
 * POST /api/admin/setup
 * Body: { token, email, password, name }
 * 
 * Requires ADMIN_SETUP_TOKEN env variable.
 * Disabled once any admin user exists.
 */
export async function POST(req: NextRequest) {
  try {
    // Run migrations first (safe - idempotent)
    await migrate();
    await seed();

    const body = await req.json();
    const { token, email, password, name } = body;

    // Verify setup token
    const expectedToken = process.env.ADMIN_SETUP_TOKEN;
    if (!expectedToken || token !== expectedToken) {
      return NextResponse.json({ error: "Invalid setup token." }, { status: 401 });
    }

    // Check if admin already exists
    const existing = await queryOne("SELECT id FROM admin_users LIMIT 1");
    if (existing) {
      return NextResponse.json(
        { error: "Admin account already exists. Setup is disabled." },
        { status: 409 }
      );
    }

    // Validate input
    if (!email || !password || password.length < 12) {
      return NextResponse.json(
        { error: "Email and password (minimum 12 characters) are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Hash password (bcrypt cost 12)
    const passwordHash = await bcrypt.hash(password, 12);

    await execute(
      "INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)",
      [email.toLowerCase(), passwordHash, name || "Admin"]
    );

    // Log activity
    await execute(
      "INSERT INTO activity_log (action, entity_type, detail) VALUES (?, ?, ?)",
      ["admin_created", "admin_user", `Admin account created for ${email}`]
    );

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully. Please log in.",
    });
  } catch (err) {
    console.error("Setup error:", err);
    return NextResponse.json({ error: "Setup failed. Check server logs." }, { status: 500 });
  }
}

/** GET /api/admin/setup — check setup status */
export async function GET() {
  try {
    await migrate();
    const existing = await queryOne("SELECT id FROM admin_users LIMIT 1");
    return NextResponse.json({
      setupRequired: !existing,
      migrationsRun: true,
    });
  } catch (err) {
    console.error("Setup check error:", err);
    return NextResponse.json({
      setupRequired: true,
      migrationsRun: false,
      error: "Database not connected. Check DB configuration.",
    });
  }
}
