"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Hash, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { getVideosByTagName } from "@/utils/api/videoApi";
import { VideoGrid } from "@/components/videos/video-grid";
import { Button } from "@/components/ui/button";

export default function TagVideosPage() {
  const params = useParams();
  const tagName = decodeURIComponent(String(params.name));
  const {
    data: videos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videos-by-tag", tagName],
    queryFn: () => getVideosByTagName(tagName),
    enabled: !!tagName,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <Link href="/videos">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Quay lại tất cả video
            </Link>
          </Button>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight md:text-4xl">
            <Hash className="h-8 w-8 text-primary" />
            {tagName}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Danh sách video với tag{" "}
            <span className="font-semibold text-foreground">{tagName}</span>.
          </p>
        </div>

        {/* ─── Error State ─── */}
        {isError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 py-12 text-center">
            <p className="text-destructive">
              Không thể tải video cho tag "{tagName}".
            </p>
            <Button
              variant="link"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        ) : (
          <VideoGrid videos={videos} isLoading={isLoading} skeletonCount={8} />
        )}
      </div>
    </div>
  );
}
