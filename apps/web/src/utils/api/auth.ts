// apps/web/src/utils/api/auth.ts
import { api } from "@/lib/api";
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
  const res = await api.post<LoginResponse>("/login", { email, password });
  return res.data;
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
  const res = await api.post("/register", { name, email, password });
  return res.data;
}

// Lấy thông tin user hiện tại (dùng access_token truyền vào)
export async function getCurrentUser(token: string): Promise<Account> {
  if (isJwtExpired(token)) {
    throw new Error("Token hết hạn");
  }
  const res = await api.get<MeApiResponse>("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.data && res.data.user) {
    return res.data.user as Account;
  }
  throw new Error("Không lấy được thông tin user");
}

// Lấy thông tin user hiện tại (dùng token trong localStorage)
export async function meApi(): Promise<MeApiResponse> {
  // Lấy token từ localStorage và kiểm tra hết hạn (nếu có logic này)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token && isJwtExpired(token)) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }
  const res = await api.get<MeApiResponse>("/me");
  if (res.data && res.data.access_token) {
    localStorage.setItem("access_token", res.data.access_token);
    return res.data.user as Account;
  }
  throw new Error("Chưa đăng nhập hoặc không tìm thấy token!");
}

// Logout API: calls backend to clear the role cookie
export async function logoutApi(): Promise<{ message: string }> {
  const res = await api.post("/logout");
  return res.data;
}
