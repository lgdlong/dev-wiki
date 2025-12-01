"use client";

import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────────────────────
// Video Skeleton Component
// ─────────────────────────────────────────────────────────────────────────────

export function VideoSkeleton() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      {/* Thumbnail Area - 16:9 aspect ratio */}
      <div className="relative aspect-video w-full">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        {/* Duration badge skeleton */}
        <div className="absolute bottom-2 right-2">
          <Skeleton className="h-5 w-12 rounded" />
        </div>
        {/* Bookmark button skeleton */}
        <div className="absolute right-2 top-2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-3 p-4">
        {/* Tags */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Title - 2 lines */}
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Grid Skeleton Component
// ─────────────────────────────────────────────────────────────────────────────

interface VideoGridSkeletonProps {
  count?: number;
}

export function VideoGridSkeleton({ count = 8 }: VideoGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <VideoSkeleton key={i} />
      ))}
    </div>
  );
}
