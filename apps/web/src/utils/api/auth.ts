// apps/web/src/utils/api/auth.ts
import { fetcher } from "@/lib/fetcher";
import { Account } from "@/types/account";
import { LoginResponse } from "@/types/auth";

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
export async function meApi(): Promise<Account> {
  // Lấy token từ localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("Chưa đăng nhập hoặc không tìm thấy token!");

  return fetcher("/me", {
    method: "GET",
    credentials: "include", // Nếu backend vẫn dùng cookie song song, có thể giữ lại; còn không thì bỏ dòng này
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
