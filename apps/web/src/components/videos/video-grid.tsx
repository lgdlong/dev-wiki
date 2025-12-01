"use client";

import type { Video } from "@/types/video";
import { VideoCard } from "./video-card";
import { VideoSkeleton } from "./video-skeleton";
import { cn } from "@/lib/utils";
import { FileVideo } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Video Grid Component
// ─────────────────────────────────────────────────────────────────────────────

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
  bookmarkedIds?: Set<number>;
  onBookmark?: (videoId: number) => void;
}

export function VideoGrid({
  videos,
  isLoading = false,
  skeletonCount = 8,
  className,
  bookmarkedIds = new Set(),
  onBookmark,
}: VideoGridProps) {
  // ─── Loading State ───
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          className,
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ─── Empty State ───
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <FileVideo className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-foreground">
          Không tìm thấy video
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
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          isBookmarked={bookmarkedIds.has(video.id)}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
}
