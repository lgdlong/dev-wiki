// apps/web/src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-900">
      <div className="flex items-center gap-6 mb-8">
        <span className="text-6xl font-light tracking-tight">404</span>
        <span className="text-zinc-400 text-3xl select-none">|</span>
        <span className="text-3xl font-light tracking-tight text-zinc-500">
          Không tìm thấy trang
        </span>
      </div>
      <Link
        href="/"
        className="px-5 py-2 bg-white hover:bg-zinc-100 rounded-full shadow border border-zinc-300 text-base font-normal text-zinc-900 transition"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
