"use client";

import type { Tutorial } from "@/types/tutorial";
import { TutorialCard } from "./tutorial-card";
import { TutorialSkeleton } from "./tutorial-skeleton";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Tutorial Grid Component
// ─────────────────────────────────────────────────────────────────────────────

interface TutorialGridProps {
  tutorials: Tutorial[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function TutorialGrid({
  tutorials,
  isLoading = false,
  skeletonCount = 6,
  className,
}: TutorialGridProps) {
  // ─── Loading State ───
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <TutorialSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ─── Empty State ───
  if (tutorials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <svg
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-base font-semibold text-foreground">
          Không tìm thấy bài viết
        </h3>
        <p className="text-sm text-muted-foreground">
          Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
        </p>
      </div>
    );
  }

  // ─── Grid Layout ───
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {tutorials.map((tutorial) => (
        <TutorialCard key={tutorial.id} tutorial={tutorial} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured Tutorial Card (Optional - for hero sections)
// ─────────────────────────────────────────────────────────────────────────────

interface FeaturedTutorialCardProps {
  tutorial: Tutorial;
  className?: string;
}

export function FeaturedTutorialCard({
  tutorial,
  className,
}: FeaturedTutorialCardProps) {
  return (
    <div className={cn("col-span-full lg:col-span-2", className)}>
      <TutorialCard
        tutorial={tutorial}
        className="md:flex-row md:items-start md:gap-6"
      />
    </div>
  );
}
