"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; // ĐÚNG cho App Router
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { loginApi } from "@/utils/api/auth";
import { LoginResponse } from "@/types/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // React Query mutation
  const mutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: loginApi,
    onSuccess: (data) => {
      // data sẽ là kiểu LoginResponse, gợi ý đầy đủ
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        console.log("[DEBUG] Token:", data.access_token);
      }
      console.log("[DEBUG] Login successful:", data.account);
      router.push("/");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-zinc-950">
      <div className="w-full max-w-sm">
        <Card className="bg-zinc-950 border-0">
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
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
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
                  <Link href="http://localhost:8000/google">
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
                  <div className="text-red-500 text-center mt-2">
                    {(mutation.error as Error).message}
                  </div>
                )}
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
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
