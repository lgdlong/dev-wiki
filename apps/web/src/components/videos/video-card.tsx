"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  PlayCircle,
  Bookmark,
  BookmarkCheck,
  User,
  Calendar,
} from "lucide-react";

import type { Video } from "@/types/video";
import type { Tag } from "@/types/tag";
import { getVideoTags } from "@/utils/api/videoApi";
import { formatDuration, getYoutubeThumbnail } from "@/utils/youtube";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function formatRelativeDate(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s} giây trước`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} ngày trước`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} tháng trước`;
    const y = Math.floor(mo / 12);
    return `${y} năm trước`;
  } catch {
    return "";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Video Card Component
// ─────────────────────────────────────────────────────────────────────────────

interface VideoCardProps {
  video: Video;
  className?: string;
  isBookmarked?: boolean;
  onBookmark?: (videoId: number) => void;
}

export function VideoCard({
  video,
  className,
  isBookmarked = false,
  onBookmark,
}: VideoCardProps) {
  // Fetch tags for this video
  const { data: tags = [], isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ["video-tags", video.id],
    queryFn: () => getVideoTags(video.id),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const thumbnailUrl =
    video.thumbnailUrl || getYoutubeThumbnail(video.youtubeId, "mq");
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const relativeDate = video.createdAt
    ? formatRelativeDate(video.createdAt)
    : "";

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.(video.id);
  };

  return (
    <div
      className={cn(
        // Base styles
        "group relative flex flex-col overflow-hidden rounded-lg",
        // Border - subtle, no shadow
        "border border-border bg-card",
        // Hover - subtle ring effect, NO lift
        "transition-all duration-200 ease-out",
        "hover:border-primary/40 hover:ring-1 hover:ring-ring/20",
        className,
      )}
    >
      {/* ─── Thumbnail Area (16:9) ─── */}
      <div className="relative w-full">
        <AspectRatio ratio={16 / 9}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={video.title || "Video thumbnail"}
            className="h-full w-full object-cover"
          />
        </AspectRatio>

        {/* Play Overlay */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100"
          aria-label={`Play ${video.title}`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background/95 text-primary shadow-lg transition-transform duration-200 group-hover:scale-105">
            <PlayCircle className="h-7 w-7" />
          </div>
        </a>

        {/* Bookmark Button - Top Right */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleBookmark}
          className={cn(
            "absolute right-2 top-2 h-8 w-8 rounded-full backdrop-blur-sm transition-all",
            isBookmarked
              ? "bg-primary/90 text-primary-foreground hover:bg-primary"
              : "bg-black/50 text-white hover:bg-black/70",
          )}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>

        {/* Duration Badge - Bottom Right */}
        {video.duration != null && (
          <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white backdrop-blur-sm">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* ─── Card Content ─── */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Tags Row - Above Title */}
        <div className="flex flex-wrap gap-1.5">
          {isLoadingTags ? (
            <>
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </>
          ) : tags.length > 0 ? (
            <>
              {tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/videos/tag/${encodeURIComponent(tag.name)}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge
                    variant="secondary"
                    className="px-2 py-0.5 text-[10px] font-medium transition-colors hover:bg-secondary/80"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))}
              {tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="px-2 py-0.5 text-[10px] font-normal text-muted-foreground"
                >
                  +{tags.length - 3}
                </Badge>
              )}
            </>
          ) : null}
        </div>

        {/* Title - 2 line clamp with hover effect */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/title"
        >
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover/title:text-primary">
            {video.title || "Video chưa có tiêu đề"}
          </h3>
        </a>

        {/* ─── Metadata Row ─── */}
        <div className="mt-auto flex items-center justify-between pt-1 text-xs text-muted-foreground">
          {/* Author */}
          <div className="flex items-center gap-1.5 truncate">
            <User className="h-3 w-3 shrink-0 opacity-60" />
            <span className="truncate">
              {video.channelTitle || "Kênh không xác định"}
            </span>
          </div>

          {/* Date */}
          {relativeDate && (
            <div className="flex shrink-0 items-center gap-1.5">
              <Calendar className="h-3 w-3 opacity-60" />
              <span>{relativeDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
