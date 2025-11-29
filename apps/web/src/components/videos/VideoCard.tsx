"use client";

import { useQuery } from "@tanstack/react-query";
import { PlayCircle, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Video } from "@/types/video";
import type { Tag } from "@/types/tag";
import { formatDuration, getYoutubeThumbnail } from "../../utils/youtube";
import { getVideoTags } from "../../utils/api/videoApi";

interface VideoCardProps {
  video: Video;
  className?: string;
}

export function VideoCard({ video, className }: VideoCardProps) {
  // 1. Fetch tags từ API cho video cụ thể này
  const { data: tags = [], isLoading: isLoadingTags } = useQuery<Tag[]>({
    queryKey: ["video-tags", video.id],
    queryFn: () => getVideoTags(video.id),
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút để tránh gọi API quá nhiều
    retry: false, // Không retry nếu lỗi (ví dụ 404 hoặc video chưa có tag)
  });

  const thumbUrl =
    video.thumbnailUrl || getYoutubeThumbnail(video.youtubeId, "mq");

  return (
    <div className={cn("group flex flex-col gap-0", className)}>
      <Card className="overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-md gap-3 rounded-none p-0">
        {/* 1. Thumbnail Area - flush top, no spacing */}
        <div className="relative w-full">
          <AspectRatio ratio={16 / 9} className="!m-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbUrl}
              alt={video.title || "Video thumbnail"}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ marginTop: 0 }}
            />
          </AspectRatio>

          {/* Overlay Gradient & Play Button - link to YouTube */}
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-black/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 text-primary shadow-lg transition-transform duration-300 hover:scale-110">
              <PlayCircle className="h-6 w-6 fill-current" />
            </div>
          </a>

          {/* Bookmark Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 hover:text-primary transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Logic bookmark có thể thêm sau
              console.log("Bookmark", video.id);
            }}
          >
            <Bookmark className="h-4 w-4" />
            <span className="sr-only">Bookmark</span>
          </Button>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* 2. Content Area */}
        <CardContent className="p-3">
          {/* Tags Section: Render tags từ API hoặc Skeleton khi đang loading */}
          <div className="mb-2 flex flex-wrap gap-1.5 min-h-[24px]">
            {isLoadingTags ? (
              // Loading state: hiện 2 skeleton badge giả
              <>
                <Skeleton className="h-5 w-12 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </>
            ) : tags.length > 0 ? (
              // Data state: hiện tối đa 3 tag đầu tiên
              tags.slice(0, 4).map((tag) => (
                <Link
                  href={`/videos/tag/${encodeURIComponent(tag.name)}`}
                  key={tag.id}
                >
                  <Badge
                    variant="secondary"
                    className="bg-secondary/50 font-normal hover:bg-secondary cursor-pointer"
                  >
                    {tag.name}
                  </Badge>
                </Link>
              ))
            ) : (
              // Empty state: Nếu không có tag nào
              <span className="text-xs text-muted-foreground/50 italic">
                No tags
              </span>
            )}
          </div>

          {/* Title: always reserve 2 lines, clamp with ellipsis if >2 */}
          <h3
            className="text-base font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "2.75em",
              maxHeight: "2.75em",
              lineClamp: 2,
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            <a
            // href={`/videos/${video.id}`}
            >
              {video.title || "Untitled Video"}
            </a>
          </h3>
        </CardContent>

        {/* 3. Footer / Meta */}
        <CardFooter className="flex items-center justify-between p-4 pt-0 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <span className="truncate hover:text-foreground">
              {video.channelTitle || "Unknown Channel"}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
