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
      router.push("/");
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold">
                Tạo tài khoản mới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                  <div className="grid gap-3">
                    <Input
                      id="name"
                      className="py-5"
                      type="text"
                      placeholder="Họ và tên"
                      autoComplete="name"
                      disabled={mutation.isPending}
                      {...register("name")}
                    />
                    {errors.name && (
                      <span className="text-destructive text-sm">
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Input
                      id="email"
                      className="py-5"
                      type="email"
                      placeholder="Địa chỉ email"
                      autoComplete="email"
                      disabled={mutation.isPending}
                      {...register("email")}
                    />
                    {errors.email && (
                      <span className="text-destructive text-sm">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="relative">
                      <Input
                        id="password"
                        className="py-5 pr-12"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        autoComplete="new-password"
                        disabled={mutation.isPending}
                        {...register("password")}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-2 flex items-center p-1 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
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
                      <span className="text-destructive text-sm">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        className="py-5 pr-12"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        autoComplete="new-password"
                        disabled={mutation.isPending}
                        {...register("confirm")}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute inset-y-0 right-2 flex items-center p-1 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirm && (
                      <span className="text-destructive text-sm">
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
                      {mutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                  </div>
                  {(errors.root?.message || mutation.isError) && (
                    <div className="text-destructive text-center mt-2 text-sm">
                      {errors.root?.message ||
                        (mutation.error as Error)?.message ||
                        "Đăng ký thất bại"}
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/login"
                    className="underline underline-offset-4 text-foreground"
                  >
                    Đăng nhập
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
