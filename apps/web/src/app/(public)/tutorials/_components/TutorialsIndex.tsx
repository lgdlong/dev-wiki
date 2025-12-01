"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Tutorial } from "@/types/tutorial";
import { getAllTutorials } from "@/utils/api/tutorialApi";
import { getAllTags } from "@/utils/api/tagApi";
import { TutorialGrid } from "@/components/tutorials/tutorial-grid";
import { Input } from "@/components/ui/input";
import TagFilterDialog from "@/components/TagFilterDialog";
import { Search } from "lucide-react";

export default function TutorialsIndex({
  initialQ = "",
  tagName = "",
}: {
  initialQ?: string;
  tagName?: string;
}) {
  const [tutorialSearch, setTutorialSearch] = useState(initialQ);
  const [selectedTag, setSelectedTag] = useState(tagName);

  const {
    data: tutorials = [],
    isLoading,
    isError,
  } = useQuery<Tutorial[]>({
    queryKey: ["tutorials"],
    queryFn: () => getAllTutorials(),
  });

  // Fetch all tags for filter
  const { data: tags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ["all-tags"],
    queryFn: () => getAllTags(),
  });

  // Filter tutorials by search and tag
  const filtered: Tutorial[] = useMemo(() => {
    let result = tutorials;
    if (selectedTag) {
      result = result.filter((t) =>
        Array.isArray(t.tags)
          ? t.tags.some((tag) => tag.name === selectedTag)
          : false,
      );
    }
    if (tutorialSearch) {
      const ql = tutorialSearch.toLowerCase();
      result = result.filter((t) => t.title?.toLowerCase().includes(ql));
    }
    return result;
  }, [tutorials, selectedTag, tutorialSearch]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="container mx-auto max-w-7xl px-4 py-12">
        {/* ─── Header + Tag Filter ─── */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
              Bài viết hướng dẫn
            </h1>
            <p className="text-muted-foreground">
              Khám phá các bài viết kỹ thuật mới nhất.
            </p>
          </div>

          <TagFilterDialog
            tags={tags}
            isLoading={isLoadingTags}
            selectedTag={selectedTag}
            onSelect={(tagName) => {
              setSelectedTag(tagName);
              window.location.href = `/tutorials/tag/${encodeURIComponent(tagName)}`;
            }}
          />
        </div>

        {/* ─── Search Bar ─── */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={tutorialSearch}
              onChange={(e) => setTutorialSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* ─── Error State ─── */}
        {isError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 py-12 text-center">
            <p className="text-destructive">
              Không thể tải danh sách bài viết.
            </p>
          </div>
        )}

        {/* ─── Tutorial Grid (handles loading, empty, and content states) ─── */}
        {!isError && (
          <TutorialGrid
            tutorials={filtered}
            isLoading={isLoading}
            skeletonCount={6}
          />
        )}
      </main>
    </div>
  );
}
