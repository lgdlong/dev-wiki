// apps/web/src/utils/api/auth.ts
import { fetcher } from "@/lib/fetcher";
import { Account } from "@/types/account";
import { LoginResponse } from "@/types/auth";
import { isJwtExpired } from "@/utils/jwt";

// Define the response type for /me
export type MeApiResponse = {
  user?: Account;
  access_token?: string;
  [key: string]: any;
};

// Đăng nhập
export async function loginApi({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  // Nếu dùng cookie/session:
  return fetcher("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
}

// Đăng ký
export async function signupApi({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  return fetcher("/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

// Lấy thông tin user hiện tại (đã đăng nhập)
export async function meApi(): Promise<MeApiResponse> {
  // Lấy token từ localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // If token exists in localStorage, use it as before
  if (token) {
    if (isJwtExpired(token)) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    return fetcher("/me", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // If no token in localStorage, try cookie-based auth
  const res = await fetcher<MeApiResponse>("/me", {
    method: "GET",
    credentials: "include",
  });

  // If backend returns access_token, store it in localStorage
  if (res && res.access_token) {
    localStorage.setItem("access_token", res.access_token);
    return res.user || (res as any as Account);
  }

  // If no user or token, throw error
  throw new Error("Chưa đăng nhập hoặc không tìm thấy token!");
}

// Logout API: calls backend to clear the role cookie
export async function logoutApi(): Promise<{ message: string }> {
  return fetcher("/logout", {
    method: "POST",
    credentials: "include",
  });
}
