"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterSidebar, type FilterTag } from "./filter-sidebar";

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Filter Sheet
// Wraps FilterSidebar inside a Sheet (Drawer) for mobile devices
// ─────────────────────────────────────────────────────────────────────────────

interface MobileFilterSheetProps {
  /** Button label */
  buttonLabel?: string;
  /** Sidebar title */
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
  /** Auto close on selection */
  closeOnSelect?: boolean;
}

export function MobileFilterSheet({
  buttonLabel = "Bộ lọc",
  title,
  tags,
  selectedTags,
  onToggle,
  onClear,
  isLoading = false,
  closeOnSelect = false,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);

  const handleToggle = (value: string) => {
    onToggle(value);
    if (closeOnSelect) {
      setOpen(false);
    }
  };

  const hasSelection = selectedTags.length > 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {buttonLabel}
          {hasSelection && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {selectedTags.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-left text-base">{title}</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-4rem)] p-4">
          <FilterSidebar
            title=""
            tags={tags}
            selectedTags={selectedTags}
            onToggle={handleToggle}
            onClear={onClear}
            isLoading={isLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
