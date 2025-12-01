"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { getAllVideos } from "@/utils/api/videoApi";
import { getAllTags } from "@/utils/api/tagApi";
import { VideoGrid } from "@/components/videos/video-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ContentWithSidebarLayout,
  NavigationFilterSidebar,
  MobileNavigationFilterSheet,
  type NavigationTag,
} from "@/components/common";

export default function VideosPage() {
  const router = useRouter();
  const [videoSearch, setVideoSearch] = useState("");

  const {
    data: videos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["videos"],
    queryFn: () => getAllVideos(),
  });

  // Fetch all tags for filter
  const { data: rawTags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["all-tags"],
    queryFn: () => getAllTags(),
  });

  // Transform tags to NavigationTag format
  const tags: NavigationTag[] = useMemo(
    () => rawTags.map((t) => ({ label: t.name, value: t.name })),
    [rawTags],
  );

  // Handle tag select - navigate to tag page
  const handleSelect = (value: string) => {
    router.push(`/videos/tag/${encodeURIComponent(value)}`);
  };

  // Filter videos by search query only (tags filter via navigation)
  const filteredVideos = useMemo(() => {
    if (!videoSearch) return videos;

    const normalizedSearch = videoSearch
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    return videos.filter((video) =>
      video.title
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .includes(normalizedSearch),
    );
  }, [videos, videoSearch]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* ─── Header Section ─── */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Thư viện Video
            </h1>
            <p className="mt-2 text-muted-foreground">
              Tuyển tập các video hướng dẫn lập trình chất lượng cao.
            </p>
          </div>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden">
            <MobileNavigationFilterSheet
              title="Chọn Tag"
              tags={tags}
              onSelect={handleSelect}
              isLoading={isLoadingTags}
            />
          </div>
        </div>

        {/* ─── Search Bar with Icon ─── */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm video..."
              value={videoSearch}
              onChange={(e) => setVideoSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* ─── Error State ─── */}
        {isError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 py-12 text-center">
            <p className="text-destructive">Không thể tải danh sách video.</p>
            <Button
              variant="link"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Thử lại
            </Button>
          </div>
        )}

        {/* ─── Content with Sidebar Layout ─── */}
        {!isError && (
          <ContentWithSidebarLayout
            sidebar={
              <NavigationFilterSidebar
                title="Chọn Tag"
                tags={tags}
                onSelect={handleSelect}
                isLoading={isLoadingTags}
              />
            }
          >
            <VideoGrid
              videos={filteredVideos}
              isLoading={isLoading}
              skeletonCount={8}
            />
          </ContentWithSidebarLayout>
        )}
      </div>
    </div>
  );
}
