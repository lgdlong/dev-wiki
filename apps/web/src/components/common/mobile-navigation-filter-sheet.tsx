"use client";

import { useState } from "react";
import { SlidersHorizontal, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationFilterSidebar,
  type NavigationTag,
} from "./navigation-filter-sidebar";

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Navigation Filter Sheet
// Wraps NavigationFilterSidebar inside a Sheet (Drawer) for mobile devices
// ─────────────────────────────────────────────────────────────────────────────

interface MobileNavigationFilterSheetProps {
  /** Button label */
  buttonLabel?: string;
  /** Sidebar title */
  title: string;
  /** Array of tags to display */
  tags: NavigationTag[];
  /** Callback when a tag is selected - navigates to tag page */
  onSelect: (value: string) => void;
  /** Loading state */
  isLoading?: boolean;
}

export function MobileNavigationFilterSheet({
  buttonLabel = "Chọn Tag",
  title,
  tags,
  onSelect,
  isLoading = false,
}: MobileNavigationFilterSheetProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Hash className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-left text-base">{title}</SheetTitle>
        </SheetHeader>
        <div className="h-[calc(100vh-4rem)] p-4">
          <NavigationFilterSidebar
            title=""
            tags={tags}
            onSelect={handleSelect}
            isLoading={isLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
