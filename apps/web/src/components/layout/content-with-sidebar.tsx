"use client";

import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Content With Sidebar Layout
// A reusable two-column layout with sticky sidebar on desktop
// ─────────────────────────────────────────────────────────────────────────────

interface ContentWithSidebarLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  mobileFilterTrigger?: React.ReactNode;
  className?: string;
  sidebarClassName?: string;
  contentClassName?: string;
}

export function ContentWithSidebarLayout({
  children,
  sidebar,
  mobileFilterTrigger,
  className,
  sidebarClassName,
  contentClassName,
}: ContentWithSidebarLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Mobile Filter Trigger - Only visible on mobile */}
      {mobileFilterTrigger && (
        <div className="lg:hidden">{mobileFilterTrigger}</div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar Column - Hidden on mobile, sticky on desktop */}
        <aside
          className={cn(
            "hidden lg:block",
            "sticky top-20",
            "h-[calc(100vh-5rem)]", // 5rem = ~80px for header
            "overflow-y-auto",
            "border-r border-border",
            "pr-6",
            sidebarClassName
          )}
        >
          {sidebar}
        </aside>

        {/* Content Column */}
        <main className={cn("min-w-0", contentClassName)}>{children}</main>
      </div>
    </div>
  );
}
