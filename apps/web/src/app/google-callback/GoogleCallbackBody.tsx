"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function GoogleCallbackBody() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      router.replace("/");
    } else {
      router.replace("/login?error=No token found");
    }
  }, [searchParams, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <span>Đang đăng nhập bằng Google...</span>
    </div>
  );
}
