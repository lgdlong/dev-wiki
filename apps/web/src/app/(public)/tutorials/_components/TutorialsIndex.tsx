"use client";

// import Link from "next/link"; // No longer needed
import { useMemo, useState } from "react";
// Removed: useTagQuery, Tag (now in TutorialCard)
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Tutorial } from "@/types/tutorial";
import { getAllTutorials, getTutorialTags } from "@/utils/api/tutorialApi";
import CardSkeleton from "./CardSkeleton";
import TutorialCard from "./TutorialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAllTags } from "@/utils/api/tagApi";
import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DATE_FMT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
};

function formatDate(d: string | number | Date) {
  try {
    return new Date(d).toLocaleDateString(undefined, DATE_FMT);
  } catch {
    return "";
  }
}

function estimateReadTime(text?: string): string {
  if (!text) return "";
  const words: number = text.trim().split(/\s+/).length;
  const minutes: number = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function TutorialsIndex({
  initialQ = "",
  tagName = "",
}: {
  initialQ?: string;
  tagName?: string;
}) {
  const router = useRouter();
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [search, setSearch] = useState(""); // for tag search in dialog
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
    <div className="min-h-screen bg-white text-zinc-900 transition-colors duration-300">
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header + tag filter */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Bài viết hướng dẫn
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Khám phá các bài viết kỹ thuật mới nhất.
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
                            <button
                              className={`block px-4 py-2 rounded w-full text-left hover:bg-zinc-100 transition ${selectedTag === tag.name ? "bg-zinc-200 font-bold" : ""}`}
                              onClick={() => {
                                setSelectedTag(tag.name);
                                setShowTagFilter(false);
                              }}
                            >
                              {tag.name}
                            </button>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thanh tìm kiếm tutorial theo tiêu đề */}
        <div className="mb-6 flex justify-start">
          <Input
            type="text"
            placeholder="Tìm kiếm bài viết theo tiêu đề..."
            value={tutorialSearch}
            onChange={(e) => setTutorialSearch(e.target.value)}
            className="w-full max-w-xs"
          />
        </div>


        {/* Loading State */}
        {isLoading && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </ul>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20">
            <p className="text-red-600 dark:text-red-400">
              Không thể tải danh sách bài viết.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Không tìm thấy bài viết nào
              {tutorialSearch ? ` cho “${tutorialSearch}”` : ""}.
            </p>
          </div>
        )}

        {/* Content Grid */}
        {filtered.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {filtered.map((t: Tutorial) => (
              <TutorialCard key={t.id} tutorial={t} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
