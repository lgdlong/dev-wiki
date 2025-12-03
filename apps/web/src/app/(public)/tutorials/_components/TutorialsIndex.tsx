"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import { Search } from "lucide-react";

import type { TutorialListItem } from "@/types/tutorial";
import {
  getAllTutorials,
  getTutorialsByTagName,
} from "@/utils/api/tutorialApi";
import { getAllTags } from "@/utils/api/tagApi";
import { TutorialGrid } from "@/components/tutorials/tutorial-grid";
import { Input } from "@/components/ui/input";
import {
  ContentWithSidebarLayout,
  FilterSidebar,
  MobileFilterSheet,
  type FilterTag,
} from "@/components/common";

export default function TutorialsIndex({
  initialQ = "",
  tagName = "",
}: {
  initialQ?: string;
  tagName?: string;
}) {
  const [tutorialSearch, setTutorialSearch] = useState(initialQ);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    tagName ? [tagName] : [],
  );

  // Fetch all tutorials (when no tags selected)
  const {
    data: allTutorials = [],
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery<TutorialListItem[]>({
    queryKey: ["tutorials"],
    queryFn: () => getAllTutorials(),
    enabled: selectedTags.length === 0,
  });

  // Fetch tutorials for each selected tag
  const tagQueries = useQueries({
    queries: selectedTags.map((tag) => ({
      queryKey: ["tutorials-by-tag", tag],
      queryFn: () => getTutorialsByTagName(tag),
      enabled: selectedTags.length > 0,
    })),
  });

  // Combine tutorials from all selected tags (intersection for AND logic)
  const tagFilteredTutorials = useMemo(() => {
    if (selectedTags.length === 0) return [];

    const allTagResults = tagQueries
      .filter((q) => q.isSuccess && q.data)
      .map((q) => q.data as TutorialListItem[]);

    if (allTagResults.length === 0) return [];
    if (allTagResults.length === 1) return allTagResults[0];

    // Intersection: tutorials that appear in ALL tag results
    const tutorialCounts = new Map<
      number,
      { tutorial: TutorialListItem; count: number }
    >();

    allTagResults.forEach((tutorials) => {
      tutorials.forEach((tutorial) => {
        const existing = tutorialCounts.get(tutorial.id);
        if (existing) {
          existing.count += 1;
        } else {
          tutorialCounts.set(tutorial.id, { tutorial, count: 1 });
        }
      });
    });

    // Return tutorials that appear in all tag results
    return Array.from(tutorialCounts.values())
      .filter((item) => item.count === allTagResults.length)
      .map((item) => item.tutorial);
  }, [tagQueries, selectedTags.length]);

  // Determine which tutorials to show
  const baseTutorials =
    selectedTags.length > 0 ? tagFilteredTutorials : allTutorials;

  // Loading state
  const isLoadingTags = tagQueries.some((q) => q.isLoading);
  const isLoading = selectedTags.length > 0 ? isLoadingTags : isLoadingAll;
  const isError =
    selectedTags.length > 0 ? tagQueries.some((q) => q.isError) : isErrorAll;

  // Fetch all tags for filter sidebar
  const { data: rawTags = [], isLoading: isLoadingTagList } = useQuery({
    queryKey: ["all-tags"],
    queryFn: () => getAllTags(),
  });

  // Transform tags to FilterTag format
  const tags: FilterTag[] = useMemo(
    () => rawTags.map((t) => ({ label: t.name, value: t.name })),
    [rawTags],
  );

  // Handle tag toggle
  const handleToggle = (value: string) => {
    setSelectedTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  // Clear all selected tags
  const handleClear = () => setSelectedTags([]);

  // Filter tutorials by search
  const filtered: TutorialListItem[] = useMemo(() => {
    if (!tutorialSearch) return baseTutorials;

    const ql = tutorialSearch.toLowerCase();
    return baseTutorials.filter((t) => t.title?.toLowerCase().includes(ql));
  }, [baseTutorials, tutorialSearch]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="container mx-auto max-w-7xl px-4 py-12">
        {/* ─── Header + Mobile Filter ─── */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
              Bài viết hướng dẫn
            </h1>
            <p className="text-muted-foreground">
              Khám phá các bài viết kỹ thuật mới nhất.
            </p>
          </div>

          {/* Mobile Filter Trigger */}
          <div className="lg:hidden">
            <MobileFilterSheet
              title="Lọc theo Tag"
              tags={tags}
              selectedTags={selectedTags}
              onToggle={handleToggle}
              onClear={handleClear}
              isLoading={isLoadingTagList}
            />
          </div>
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

        {/* ─── Content with Sidebar Layout ─── */}
        {!isError && (
          <ContentWithSidebarLayout
            sidebar={
              <FilterSidebar
                title="Lọc theo Tag"
                tags={tags}
                selectedTags={selectedTags}
                onToggle={handleToggle}
                onClear={handleClear}
                isLoading={isLoadingTagList}
              />
            }
          >
            <TutorialGrid
              tutorials={filtered}
              isLoading={isLoading}
              skeletonCount={6}
            />
          </ContentWithSidebarLayout>
        )}
      </main>
    </div>
  );
}
