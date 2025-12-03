"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Terminal,
  Code2,
  Database,
  Globe,
  Cpu,
  Cloud,
  Shield,
  Layers,
  FileCode,
  type LucideIcon,
} from "lucide-react";

import type { Tag } from "@/types/tag";
import type { TutorialListItem } from "@/types/tutorial";
import { getTutorialTags } from "@/utils/api/tutorialApi";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Category Icon Mapping
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  container: Box,
  docker: Box,
  devops: Terminal,
  terminal: Terminal,
  backend: Code2,
  api: Code2,
  database: Database,
  sql: Database,
  web: Globe,
  frontend: Globe,
  hardware: Cpu,
  system: Cpu,
  cloud: Cloud,
  aws: Cloud,
  azure: Cloud,
  security: Shield,
  architecture: Layers,
  default: FileCode,
};

function getCategoryIcon(tags: Tag[]): LucideIcon {
  if (!tags?.length) return CATEGORY_ICONS.default;

  for (const tag of tags) {
    const key = tag.name.toLowerCase();
    if (CATEGORY_ICONS[key]) return CATEGORY_ICONS[key];
  }

  return CATEGORY_ICONS.default;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s} giây trước`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} ngày trước`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} tháng trước`;
    const y = Math.floor(mo / 12);
    return `${y} năm trước`;
  } catch {
    return "";
  }
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Tutorial Card Component
// ─────────────────────────────────────────────────────────────────────────────

interface TutorialCardProps {
  tutorial: TutorialListItem;
  className?: string;
}

export function TutorialCard({ tutorial, className }: TutorialCardProps) {
  const href = `/tutorials/${tutorial.slug}`;

  // Fetch tags for this tutorial
  const { data: tags = [], isLoading: tagsLoading } = useQuery<Tag[]>({
    queryKey: ["tutorial-tags", tutorial.id],
    queryFn: () => getTutorialTags(tutorial.id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const CategoryIcon = getCategoryIcon(tags);
  const relativeDate = tutorial.createdAt ? timeAgo(tutorial.createdAt) : null;

  return (
    <Link
      href={href}
      className={cn(
        // Base styles
        "group relative flex h-full flex-col rounded-lg border border-border bg-card p-5",
        // Transition
        "transition-all duration-200 ease-out",
        // Hover effects - the "Linear glow"
        "hover:border-border/80 hover:shadow-sm hover:ring-1 hover:ring-ring/10",
        "hover:-translate-y-0.5",
        className,
      )}
    >
      {/* ─── Header: Icon + Meta ─── */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted/50 text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <CategoryIcon className="h-4 w-4" />
        </div>
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {relativeDate && <span>{relativeDate}</span>}
        </div>
      </div>

      {/* ─── Title ─── */}
      <h2 className="mb-2 line-clamp-2 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
        {tutorial.title}
      </h2>

      {/* ─── Tags ─── */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tagsLoading ? (
          <>
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </>
        ) : tags.length > 0 ? (
          tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="px-2 py-0.5 text-[10px] font-medium transition-colors hover:bg-secondary/80"
            >
              {tag.name}
            </Badge>
          ))
        ) : null}
        {tags.length > 3 && (
          <Badge
            variant="outline"
            className="px-2 py-0.5 text-[10px] font-normal text-muted-foreground"
          >
            +{tags.length - 3}
          </Badge>
        )}
      </div>

      {/* ─── Footer: Author ─── */}
      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={tutorial.authorAvatarUrl || undefined}
            alt={tutorial.authorName || "Author"}
          />
          <AvatarFallback className="text-[10px] font-medium">
            {getInitials(tutorial.authorName)}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs font-medium text-foreground">
          {tutorial.authorName || "Anonymous"}
        </span>
      </div>
    </Link>
  );
}
