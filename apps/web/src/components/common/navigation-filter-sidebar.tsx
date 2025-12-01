"use client";

import { useState, useMemo } from "react";
import { Search, X, Hash } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface NavigationTag {
  label: string;
  value: string;
  count?: number;
}

interface NavigationFilterSidebarProps {
  /** Sidebar title (e.g., "Chọn Tag") */
  title: string;
  /** Array of tags to display */
  tags: NavigationTag[];
  /** Callback when a tag is clicked - navigates to tag page */
  onSelect: (value: string) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Show search input if tags > threshold */
  searchThreshold?: number;
  /** Additional className */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation Filter Sidebar Component
// For single-select with navigation (e.g., Videos page)
// ─────────────────────────────────────────────────────────────────────────────

export function NavigationFilterSidebar({
  title,
  tags,
  onSelect,
  isLoading = false,
  searchThreshold = 10,
  className,
}: NavigationFilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tags by search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    const query = searchQuery.toLowerCase();
    return tags.filter((tag) => tag.label.toLowerCase().includes(query));
  }, [tags, searchQuery]);

  // Sort alphabetically
  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => a.label.localeCompare(b.label));
  }, [filteredTags]);

  const showSearch = tags.length > searchThreshold;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* ─── Header ─── */}
      <div className="mb-4">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
      </div>

      {/* ─── Search Input ─── */}
      {showSearch && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* ─── Description ─── */}
      <p className="mb-3 text-xs text-muted-foreground">
        Chọn một tag để xem nội dung liên quan
      </p>

      {/* ─── Tag List ─── */}
      <ScrollArea className="-mr-4 flex-1 pr-4">
        {isLoading ? (
          <NavigationSidebarSkeleton />
        ) : sortedTags.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {searchQuery ? "Không tìm thấy tag phù hợp" : "Không có tag nào"}
          </div>
        ) : (
          <div className="space-y-1">
            {sortedTags.map((tag) => (
              <NavigationTagItem
                key={tag.value}
                tag={tag}
                onSelect={() => onSelect(tag.value)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation Tag Item Component
// ─────────────────────────────────────────────────────────────────────────────

interface NavigationTagItemProps {
  tag: NavigationTag;
  onSelect: () => void;
}

function NavigationTagItem({ tag, onSelect }: NavigationTagItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <Hash className="h-3.5 w-3.5 shrink-0" />
      <span className="flex-1 truncate">{tag.label}</span>
      {tag.count !== undefined && (
        <span className="text-xs tabular-nums text-muted-foreground/60">
          ({tag.count})
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton Loader
// ─────────────────────────────────────────────────────────────────────────────

function NavigationSidebarSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
