"use client";

import { useState, useMemo } from "react";
import { Search, X, RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FilterTag {
  label: string;
  value: string;
  count?: number;
}

interface FilterSidebarProps {
  /** Sidebar title (e.g., "Filter Videos") */
  title: string;
  /** Array of tags to display */
  tags: FilterTag[];
  /** Currently selected tag values */
  selectedTags: string[];
  /** Callback when a tag is toggled */
  onToggle: (value: string) => void;
  /** Callback to clear all selections */
  onClear: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Show search input if tags > threshold */
  searchThreshold?: number;
  /** Additional className */
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Sidebar Component
// ─────────────────────────────────────────────────────────────────────────────

export function FilterSidebar({
  title,
  tags,
  selectedTags,
  onToggle,
  onClear,
  isLoading = false,
  searchThreshold = 10,
  className,
}: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tags by search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tags;
    const query = searchQuery.toLowerCase();
    return tags.filter((tag) => tag.label.toLowerCase().includes(query));
  }, [tags, searchQuery]);

  // Sort: selected first, then alphabetically
  const sortedTags = useMemo(() => {
    return [...filteredTags].sort((a, b) => {
      const aSelected = selectedTags.includes(a.value);
      const bSelected = selectedTags.includes(b.value);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.label.localeCompare(b.label);
    });
  }, [filteredTags, selectedTags]);

  const hasSelection = selectedTags.length > 0;
  const showSearch = tags.length > searchThreshold;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* ─── Header ─── */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        {hasSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
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

      {/* ─── Selection Count ─── */}
      {hasSelection && (
        <div className="mb-3 text-xs text-muted-foreground">
          Đã chọn:{" "}
          <span className="font-medium text-foreground">
            {selectedTags.length}
          </span>{" "}
          tag
        </div>
      )}

      {/* ─── Tag List ─── */}
      <ScrollArea className="flex-1 -mr-4 pr-4">
        {isLoading ? (
          <FilterSidebarSkeleton />
        ) : sortedTags.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            {searchQuery ? "Không tìm thấy tag phù hợp" : "Không có tag nào"}
          </div>
        ) : (
          <div className="space-y-1">
            {sortedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.value);
              return (
                <FilterTagItem
                  key={tag.value}
                  tag={tag}
                  isSelected={isSelected}
                  onToggle={() => onToggle(tag.value)}
                />
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter Tag Item Component
// ─────────────────────────────────────────────────────────────────────────────

interface FilterTagItemProps {
  tag: FilterTag;
  isSelected: boolean;
  onToggle: () => void;
}

function FilterTagItem({ tag, isSelected, onToggle }: FilterTagItemProps) {
  return (
    <label
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer",
        "hover:bg-muted/50",
        isSelected && "bg-muted",
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className="pointer-events-none"
      />
      <span
        className={cn(
          "flex-1 truncate",
          isSelected ? "font-medium text-foreground" : "text-muted-foreground",
        )}
      >
        {tag.label}
      </span>
      {tag.count !== undefined && (
        <span className="text-xs tabular-nums text-muted-foreground/60">
          ({tag.count})
        </span>
      )}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton Loader
// ─────────────────────────────────────────────────────────────────────────────

function FilterSidebarSkeleton() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-3 w-8" />
        </div>
      ))}
    </div>
  );
}
