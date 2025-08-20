import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  // Admin chỉ được vào /admin/**
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Mod chỉ được vào /mod/**
  if (pathname.startsWith("/mod")) {
    if (role !== "mod") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Các path khác (user + client) → chặn nếu là admin/mod cố tình vào
  if (role === "admin" || role === "mod") {
    // Nếu admin/mod cố vào / hoặc /user/... → redirect về đúng "home" của họ
    const home = role === "admin" ? "/admin" : "/mod";
    return NextResponse.redirect(new URL(home, request.url));
  }

  // Mặc định cho user/client vào
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
  // Áp dụng cho tất cả route, trừ assets tĩnh
};
