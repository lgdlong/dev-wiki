"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link"; // Dùng Link của Next.js thay vì thẻ a

export default function Home() {
  const { data: account, isLoading, isError } = useCurrentUser();
  const { handleLogout, isPending } = useLogout();

  return (
    // Thay bg-zinc-950 -> bg-background
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <main className="flex flex-col gap-6 items-center w-full max-w-md">
        <h1 className="text-4xl font-semibold text-foreground mb-2 text-center">
          {isLoading && "Đang tải..."}
          {isError && "Bạn chưa đăng nhập"}
          {account && <>Xin chào.</>}
        </h1>

        {account && (
          // bg-zinc-900 -> bg-card, border-zinc-700 -> border-border
          <div className="w-full rounded-2xl bg-card border border-border p-6 shadow-sm flex flex-col items-center gap-2">
            <div className="text-muted-foreground text-base">{account.email}</div>
            <div className="text-muted-foreground text-base">{account.name}</div>
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="mt-4 px-6 py-2 rounded-full border border-input text-foreground hover:bg-accent hover:text-accent-foreground transition disabled:opacity-60"
            >
              Đăng xuất
            </button>
          </div>
        )}

        {!isLoading && !account && (
          <Link
            href="/login"
            className="inline-block mt-4 px-6 py-2 rounded-full border border-input text-foreground hover:bg-accent hover:text-accent-foreground transition"
          >
            Đăng nhập
          </Link>
        )}
      </main>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dev Wiki. Powered by Next.js + NestJS.
      </footer>
    </div>
  );
}
