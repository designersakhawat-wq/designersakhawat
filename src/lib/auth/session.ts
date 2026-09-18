import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface SessionData {
  adminId?: number;
  adminEmail?: string;
  adminName?: string;
  isLoggedIn?: boolean;
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "fallback-secret-minimum-32-characters-long",
  cookieName: "portfolio_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAdminSession(): Promise<SessionData> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.adminId) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Middleware helper - call in API route handlers to guard admin endpoints
 */
export async function requireAdmin(
  req: NextRequest,
  handler: (req: NextRequest, session: SessionData) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.isLoggedIn || !session.adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(req, session);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
