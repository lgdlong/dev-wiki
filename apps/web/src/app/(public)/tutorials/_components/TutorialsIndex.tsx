"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Tutorial } from "@/types/tutorial";
import { getAllTutorials } from "@/utils/api/tutorialApi";
import CardSkeleton from "./CardSkeleton";
import { Search } from "lucide-react";

const DATE_FMT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};
function formatDate(d: string | number | Date) {
  try {
    return new Date(d).toLocaleDateString(undefined, DATE_FMT);
  } catch {
    return "";
  }
}
function estimateReadTime(text?: string): string {
  if (!text) return "";
  const words: number = text.trim().split(/\s+/).length;
  const minutes: number = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function TutorialsIndex({
  initialQ = "",
}: {
  initialQ?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);

  const {
    data: tutorials = [],
    isLoading,
    isError,
  } = useQuery<Tutorial[]>({
    queryKey: ["tutorials", { q }],
    queryFn: () => getAllTutorials(),
  });

  const filtered: Tutorial[] = useMemo(() => {
    if (!q) return tutorials;
    const ql = q.toLowerCase();
    return tutorials.filter((t) => t.title?.toLowerCase().includes(ql));
  }, [tutorials, q]);

  return (
    // Sử dụng min-h-screen và màu nền zinc-950 để bao phủ toàn bộ vùng nhìn
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header + search */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Bài viết hướng dẫn
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Khám phá các bài viết kỹ thuật mới nhất.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget as HTMLFormElement);
              const nextQ = String(fd.get("q") || "");
              setQ(nextQ);
              const usp = new URLSearchParams();
              if (nextQ) usp.set("q", nextQ);
              router.push(`?${usp.toString()}`);
            }}
            className="relative w-full md:w-auto group"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              name="q"
              defaultValue={initialQ}
              placeholder="Tìm kiếm bài viết..."
              className="w-full md:w-80 pl-10 pr-4 py-2.5 rounded-lg
                bg-white dark:bg-zinc-900
                border border-zinc-200 dark:border-zinc-800
                text-zinc-900 dark:text-zinc-100
                placeholder:text-zinc-400 dark:placeholder:text-zinc-500
                focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-600
                transition-all"
            />
          </form>
        </div>

        {/* Loading State */}
        {isLoading && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </ul>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
            <p className="text-red-600 dark:text-red-400">
              Không thể tải danh sách bài viết.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Không tìm thấy bài viết nào{q ? ` cho “${q}”` : ""}.
            </p>
          </div>
        )}

        {/* Content Grid */}
        {filtered.length > 0 && (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((t: Tutorial) => {
              const href = `/tutorials/${t.slug}`;

              // Tách riêng các phần subtitle để dễ style
              const dateStr = t.createdAt
                ? formatDate(t.createdAt as any)
                : null;
              const viewsStr = t.views != null ? `${t.views} views` : null;
              const readTimeStr = estimateReadTime(t.content as any);

              return (
                <li key={t.id} className="h-full">
                  <Link
                    href={href}
                    className="flex h-full flex-col p-6 rounded-xl border transition-all duration-200
                      bg-white dark:bg-zinc-900/50
                      border-zinc-200 dark:border-zinc-800
                      hover:border-zinc-300 dark:hover:border-zinc-600
                      hover:shadow-lg dark:hover:bg-zinc-900
                      group"
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-3">
                      {dateStr && <span>{dateStr}</span>}
                      {dateStr && readTimeStr && (
                        <span className="text-zinc-300 dark:text-zinc-700">
                          •
                        </span>
                      )}
                      {readTimeStr && <span>{readTimeStr}</span>}
                    </div>

                    <h2
                      className="text-xl font-bold leading-snug mb-3 line-clamp-2
                      text-zinc-900 dark:text-zinc-100
                      group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    >
                      {t.title}
                    </h2>

                    <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                      <span className="text-zinc-500 dark:text-zinc-500 font-medium">
                        {viewsStr}
                      </span>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200 group-hover:translate-x-1 transition-transform inline-flex items-center">
                        Read more
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
