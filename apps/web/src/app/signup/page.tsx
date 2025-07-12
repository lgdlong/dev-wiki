"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "@/validations/signup-schema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signupApi } from "@/utils/api/auth";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  // Sử dụng react-hook-form với zod để validate form và hiển thị lỗi
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const mutation = useMutation({
    mutationFn: signupApi,
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      // Xử lý thành công, ví dụ: lưu user, token, redirect...
      router.push("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      // Nếu backend trả lỗi, bạn có thể dùng setError để hiện lỗi cho từng field hoặc chung
      setError("root", { message: err.message || "Đăng ký thất bại" });
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    mutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="bg-zinc-950 border-0">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                Create your account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                  {/* Name */}
                  <div className="grid gap-3">
                    <Input
                      id="name"
                      className="py-5"
                      type="text"
                      placeholder="Full Name"
                      autoComplete="name"
                      disabled={mutation.isPending}
                      {...register("name")}
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  {/* Email */}
                  <div className="grid gap-3">
                    <Input
                      id="email"
                      className="py-5"
                      type="email"
                      placeholder="Email Address"
                      autoComplete="email"
                      disabled={mutation.isPending}
                      {...register("email")}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  {/* Password */}
                  <div className="grid gap-3">
                    <div className="relative">
                      <Input
                        id="password"
                        className="py-5 pr-12"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="new-password"
                        disabled={mutation.isPending}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-2 flex items-center p-1 text-zinc-400 hover:text-zinc-200"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="text-red-500 text-sm">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  {/* Confirm Password */}
                  <div className="grid gap-3">
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        className="py-5 pr-12"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        disabled={mutation.isPending}
                        {...register("confirm")}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute inset-y-0 right-2 flex items-center p-1 text-zinc-400 hover:text-zinc-200"
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirm && (
                      <span className="text-red-500 text-sm">
                        {errors.confirm.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <Button
                      type="submit"
                      className="w-full py-5"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Signing up..." : "Sign up"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full py-5"
                      type="button"
                      disabled={mutation.isPending}
                    >
                      Sign up with Google
                    </Button>
                  </div>
                  {/* Hiện lỗi của mutation hoặc lỗi chung (vd: backend trả về) */}
                  {(errors.root?.message || mutation.isError) && (
                    <div className="text-red-500 text-center mt-2">
                      {errors.root?.message ||
                        (mutation.error as Error)?.message ||
                        "Đăng ký thất bại"}
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
