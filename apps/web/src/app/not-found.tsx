// apps/web/src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="flex items-center gap-6 mb-8">
        <span className="text-6xl font-light tracking-tight">404</span>
        <span className="text-zinc-600 text-3xl select-none">|</span>
        <span className="text-3xl font-light tracking-tight text-zinc-300">
          Page not found
        </span>
      </div>
      <Link
        href="/"
        className="px-5 py-2 bg-zinc-950 hover:bg-zinc-900 rounded-full shadow border border-zinc-700 text-base font-normal transition"
      >
        Go Home
      </Link>
    </div>
  );
}
