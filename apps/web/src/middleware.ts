// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Role = "admin" | "mod" | "user" | "guest";

const ADMIN: Role = "admin";
const MOD: Role = "mod";
const GUEST: Role = "guest";

const ADMIN_PATH = "/admin";
const MOD_PATH = "/mod";
const ROOT_PATH = "/";

const isAdmin = (role: Role) => role === ADMIN;
const isMod = (role: Role) => role === MOD;

const toURL = (path: string, req: NextRequest) => new URL(path, req.url);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const raw = request.cookies.get("role")?.value ?? GUEST;
  const role = (["admin", "mod", "user", "guest"].includes(raw) ? raw : GUEST) as Role;

  // 1) /admin/** → chỉ admin
  if (pathname.startsWith(ADMIN_PATH)) {
    if (!isAdmin(role)) {
      const target = toURL(ROOT_PATH, request);
      if (target.href !== request.url) return NextResponse.redirect(target);
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // 2) /mod/** → chỉ mod
  if (pathname.startsWith(MOD_PATH)) {
    if (!isMod(role)) {
      const target = toURL(ROOT_PATH, request);
      if (target.href !== request.url) return NextResponse.redirect(target);
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // 3) Các path khác (vùng user/client)
  //    Nếu admin/mod cố vào → đẩy về dashboard đúng role
  if (isAdmin(role) || isMod(role)) {
    const dashboard = isAdmin(role) ? ADMIN_PATH : MOD_PATH;
    // Tránh redirect loop nếu đã ở đúng dashboard
    if (!pathname.startsWith(dashboard)) {
      const target = toURL(dashboard, request);
      if (target.href !== request.url) return NextResponse.redirect(target);
    }
  }

  // 4) Mặc định cho qua
  return NextResponse.next();
}

// Chỉ định rõ ràng matcher cho hiệu năng + tránh động vào API/public assets.
// - Áp cho /admin/** và /mod/**
// - Áp cho toàn bộ còn lại, TRỪ _next static/image, favicon, và /api/**
export const config = {
  matcher: [
    "/admin/:path*",
    "/mod/:path*",
    // “global user/client area” – nhưng loại trừ _next, favicon, api
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
