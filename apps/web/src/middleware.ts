// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWTValidator, type JwtPayload } from "./lib/jwt";

type Role = "admin" | "mod" | "user" | "guest";

const ADMIN: Role = "admin";
const MOD: Role = "mod";
const GUEST: Role = "guest";

const ADMIN_PATH = "/admin";
const MOD_PATH = "/mod";
const ROOT_PATH = "/";
const LOGIN_PATH = "/login";

const isAdmin = (role: Role) => role === ADMIN;
const isMod = (role: Role) => role === MOD || role === ADMIN; // Admin can access mod routes
const isAuthenticated = (role: Role) => role !== GUEST;

const toURL = (path: string, req: NextRequest) => new URL(path, req.url);

/**
 * Extracts JWT token from request and validates it
 * Returns the user's role or 'guest' if invalid/missing
 */
async function getUserRoleFromJWT(request: NextRequest): Promise<Role> {
  try {
    // Extract token from Authorization header or cookies
    const authHeader = request.headers.get("authorization");
    let token: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      // Fallback: try to get token from cookies
      token = request.cookies.get("token")?.value || null;
    }

    if (!token) {
      return GUEST;
    }

    // Validate the JWT token
    const payload = await JWTValidator.validateToken(token);
    if (!payload || !payload.role) {
      return GUEST;
    }

    // Ensure the role is valid
    const validRoles: Role[] = ["admin", "mod", "user", "guest"];
    if (validRoles.includes(payload.role as Role)) {
      return payload.role as Role;
    }

    return GUEST;
  } catch (error) {
    console.warn("Error validating JWT in middleware:", error);
    return GUEST;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user role from JWT token (secure validation)
  const role = await getUserRoleFromJWT(request);

  // 1) /admin/** → only admin
  if (pathname.startsWith(ADMIN_PATH)) {
    if (!isAdmin(role)) {
      // Redirect unauthenticated users to login, others to root
      const target =
        role === GUEST ? toURL(LOGIN_PATH, request) : toURL(ROOT_PATH, request);
      if (target.href !== request.url) return NextResponse.redirect(target);
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // 2) /mod/** → mod or admin
  if (pathname.startsWith(MOD_PATH)) {
    if (!isMod(role)) {
      // Redirect unauthenticated users to login, others to root
      const target =
        role === GUEST ? toURL(LOGIN_PATH, request) : toURL(ROOT_PATH, request);
      if (target.href !== request.url) return NextResponse.redirect(target);
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // 3) Auto-redirect authenticated users to their appropriate dashboard
  if (
    isAuthenticated(role) &&
    (pathname === ROOT_PATH || pathname === LOGIN_PATH)
  ) {
    const dashboard = isAdmin(role)
      ? ADMIN_PATH
      : isMod(role)
        ? MOD_PATH
        : ROOT_PATH;

    // Only redirect if not already on the correct dashboard
    if (dashboard !== ROOT_PATH && !pathname.startsWith(dashboard)) {
      const target = toURL(dashboard, request);
      if (target.href !== request.url) return NextResponse.redirect(target);
    }
  }

  // 4) Default: allow through
  return NextResponse.next();
}

// Chỉ định rõ ràng matcher cho hiệu năng + tránh động vào API/public assets.
// - Áp cho /admin/** và /mod/**
// - Áp cho toàn bộ còn lại, TRỪ _next static/image, favicon, và /api/**
export const config = {
  matcher: [
    "/admin/:path*",
    "/mod/:path*",
    // "global user/client area" – nhưng loại trừ _next, favicon, api
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
