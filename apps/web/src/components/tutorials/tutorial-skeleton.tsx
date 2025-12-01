"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TutorialSkeleton() {
  return (
    <div className="group relative flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-all duration-200">
      {/* Category icon + meta */}
      <div className="mb-3 flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Title - 2 lines */}
      <div className="mb-2 space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>

      {/* Description - 3 lines */}
      <div className="mb-4 space-y-1.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>

      {/* Tags */}
      <div className="mb-4 flex gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>

      {/* Author row */}
      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-3 w-24" />
        <div className="ml-auto flex items-center gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TutorialGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TutorialSkeleton key={i} />
      ))}
    </div>
  );
}
