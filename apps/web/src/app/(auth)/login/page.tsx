"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { loginApi, getCurrentUser } from "@/utils/api/auth";
import { LoginResponse } from "@/types/auth";
import { NEXT_PUBLIC_GOOGLE_AUTH_URL } from "@/config/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const mutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        try {
          // Gọi API lấy user info với access_token vừa nhận
          const user = await getCurrentUser(data.access_token);

          if (user.role === "mod") {
            router.push("/mod");
          } else if (user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/");
          }
        } catch (err) {
          // Nếu lỗi khi lấy user info, xóa token và báo lỗi
          localStorage.removeItem("access_token");
          alert("Login failed: Cannot fetch user info");
        }
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    // bg-zinc-950 -> bg-background
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        {/* Card tự động có bg-card theo theme, bỏ bg-zinc-950 */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">
              Log in to Dev Wiki
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <div className="grid gap-3">
                  <Input
                    id="email"
                    className="py-5"
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={mutation.isPending}
                  />
                </div>
                <div className="grid gap-3">
                  <Input
                    id="password"
                    className="py-5"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={mutation.isPending}
                  />
                  <div className="flex items-center">
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full py-5"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                  <Link
                    href={NEXT_PUBLIC_GOOGLE_AUTH_URL || "#"}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full py-5"
                      type="button"
                    >
                      Login with Google
                    </Button>
                  </Link>
                </div>
                {mutation.isError && (
                  <div className="text-destructive text-center mt-2 text-sm">
                    {(mutation.error as Error).message}
                  </div>
                )}
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="underline underline-offset-4 text-foreground"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
