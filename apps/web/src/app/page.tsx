"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Home() {
  const { data: account, isLoading, isError } = useCurrentUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 px-4">
      <main className="flex flex-col gap-6 items-center w-full max-w-md">
        <h1 className="text-4xl font-semibold text-zinc-100 mb-2 text-center">
          {isLoading && "Đang tải..."}
          {isError && "Bạn chưa đăng nhập"}
          {account && <>Xin chào.</>}
        </h1>

        {account && (
          <div className="w-full rounded-2xl bg-zinc-900 p-6 shadow flex flex-col items-center gap-2">
            <div className="text-zinc-400 text-base">{account.email}</div>
            <div className="text-zinc-400 text-base">{account.name}</div>
          </div>
        )}

        {!isLoading && !account && (
          <a
            href="/login"
            className="inline-block mt-4 px-6 py-2 rounded-full border border-zinc-700 text-zinc-100 hover:bg-zinc-900 transition"
          >
            Đăng nhập
          </a>
        )}
      </main>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Dev Wiki. Powered by Next.js + NestJS.
      </footer>
    </div>
  );
}
