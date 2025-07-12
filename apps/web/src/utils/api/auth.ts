// apps/web/src/utils/api/auth.ts
import { fetcher } from "@/lib/fetcher";

// Đăng nhập
export async function loginApi({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
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
