"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import type { Tutorial } from "@/types/tutorial";
import { getAllTutorials } from "@/utils/api/tutorialApi";

const DATE_FMT: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "2-digit" };

function formatDate(d: string | number | Date) {
  try { return new Date(d).toLocaleDateString(undefined, DATE_FMT); } catch { return ""; }
}
function estimateReadTime(text?: string) {
  if (!text) return "";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function CardSkeleton() {
  return (
    <li className="animate-pulse">
      <div className="h-full p-4 border rounded-lg">
        <div className="h-5 w-3/4 bg-zinc-200 rounded mb-3" />
        <div className="h-4 w-full bg-zinc-200 rounded mb-2" />
        <div className="h-4 w-2/3 bg-zinc-200 rounded" />
      </div>
    </li>
  );
}

export default function TutorialsIndex() {
  const params = useSearchParams();
  const router = useRouter();
  const q: string = params.get("q") ?? "";

  const { data: tutorials = [], isLoading, isError } = useQuery<Tutorial[]>({
    queryKey: ["tutorials", { q }],
    queryFn: () => getAllTutorials(),
  });

  const filtered: Tutorial[] = useMemo(() => {
    if (!q) return tutorials;
    const ql = q.toLowerCase();
    return tutorials.filter(
      (t) =>
        t.title?.toLowerCase().includes(ql)
    );
  }, [tutorials, q]);

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header + search */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">Tutorials</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            const next = new URLSearchParams(params);
            const nextQ = String(fd.get("q") || "");
            if (nextQ) next.set("q", nextQ);
            else next.delete("q");
            router.push(`?${next.toString()}`);
          }}
          className="flex items-center gap-2"
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Search tutorials…"
            className="w-56 md:w-72 px-3 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          <button className="px-3 py-2 border rounded-lg" type="submit">
            Search
          </button>
        </form>
      </div>

      {isLoading && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </ul>
      )}

      {isError && <p className="text-red-600">Error loading tutorials.</p>}

      {!isLoading && !isError && filtered.length === 0 && (
        <p className="text-zinc-600">
          No tutorials found{q ? ` for “${q}”` : ""}.
        </p>
      )}

      {filtered.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const href = `/tutorials/${t.slug}`;
            const subtitle = [
              t.createdAt ? formatDate(t.createdAt as any) : undefined,
              t.views != null ? `${t.views} views` : undefined,
              estimateReadTime(t.content as any),
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <li key={t.id} className="h-full">
                <Link
                  href={href}
                  className="flex h-full flex-col p-4 border rounded-lg hover:border-black transition-colors"
                >
                  <h2 className="text-lg md:text-xl font-semibold line-clamp-2">
                    {t.title}
                  </h2>
                  {subtitle && (
                    <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
                  )}
                  <span className="mt-auto pt-3 text-sm font-medium text-zinc-800 hover:underline">
                    Read more →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
