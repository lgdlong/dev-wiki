import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  // Chặn nếu vào /admin mà không phải admin
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Chặn nếu vào /mod mà không phải mod hoặc admin
  if (pathname.startsWith("/mod") && role !== "mod" && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Các trường hợp còn lại được đi tiếp
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mod/:path*"],
};
