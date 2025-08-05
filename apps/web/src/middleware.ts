import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// (Ví dụ) Bạn lưu role user ở cookie (hoặc JWT/session)
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Đọc role từ cookie
  const role = request.cookies.get("role")?.value;

  // Chặn user thường vào admin/mod
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/mod")) &&
    role === "user"
  ) {
    // Có thể chuyển sang trang 403 hoặc về trang chủ
    return NextResponse.redirect(new URL("/", request.url));
  }

  // (Tuỳ ý) Chặn khách chưa đăng nhập vào các trang cần login
  // if (!role && pathname.startsWith("/admin")) ...

  // Các trường hợp khác cho đi tiếp
  return NextResponse.next();
}

// Chỉ áp dụng cho các route cần check
export const config = {
  matcher: ["/admin/:path*", "/mod/:path*"], // Thêm pattern tuỳ ý
};
