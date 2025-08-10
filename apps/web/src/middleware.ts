import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  // Block access to /admin if the user is not an admin
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Block access to /mod if the user is not a mod or admin
  if (pathname.startsWith("/mod") && role !== "mod" && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow all other cases to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/mod/:path*"],
};
