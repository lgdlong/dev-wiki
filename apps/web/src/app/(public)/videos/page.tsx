"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllVideos, getVideoTags } from "@/utils/api/videoApi";
import { VideoCard } from "@/components/videos/VideoCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { getAllTags } from "@/utils/api/tagApi";

export default function VideosPage() {
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [search, setSearch] = useState("");
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
  const { data: tags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["all-tags"],
    queryFn: () => getAllTags(),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Thư viện Video
            </h1>
            <p className="mt-2 text-muted-foreground">
              Tuyển tập các video hướng dẫn lập trình chất lượng cao.
            </p>
          </div>

          <Dialog open={showTagFilter} onOpenChange={setShowTagFilter}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-9 gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Lọc theo Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl p-0 top-1/3">
              <div className="flex justify-end p-2"></div>
              <div className="p-4 pt-2 flex flex-col gap-2">
                <Input
                  placeholder="Tìm tag..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-2"
                />
                <div className="overflow-y-auto max-h-100">
                  {isLoadingTags ? (
                    <div className="text-center text-muted-foreground py-8">
                      Loading tags...
                    </div>
                  ) : tags.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No tags found.
                    </div>
                  ) : (
                    <ul className="space-y-1">
                      {[...tags]
                        .filter((tag) =>
                          tag.name.toLowerCase().includes(search.toLowerCase()),
                        )
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((tag) => (
                          <li key={tag.id}>
                            <Link
                              href={`/videos/tag/${encodeURIComponent(tag.name)}`}
                              className="block px-4 py-2 rounded hover:bg-muted transition"
                              onClick={() => setShowTagFilter(false)}
                            >
                              {tag.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thanh tìm kiếm video theo tiêu đề */}
        <div className="mb-6 flex justify-start">
          <Input
            type="text"
            placeholder="Tìm kiếm video theo tiêu đề..."
            value={videoSearch}
            onChange={(e) => setVideoSearch(e.target.value)}
            className="w-full max-w-xs"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="space-y-2 p-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-2 pt-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-destructive">Không thể tải danh sách video.</p>
              <Button
                variant="link"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Thử lại
              </Button>
            </div>
          ) : videos.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              Không có video nào. Vui lòng quay lại sau!
            </div>
          ) : (
            // Lọc video theo tiêu đề
            videos
              .filter((video) =>
                video.title
                  ?.toLowerCase()
                  .normalize("NFD")
                  .replace(/\p{Diacritic}/gu, "")
                  .includes(
                    videoSearch
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/\p{Diacritic}/gu, ""),
                  ),
              )
              .map((video) => <VideoCard key={video.id} video={video} />)
          )}
        </div>
      </div>
    </div>
  );
}
