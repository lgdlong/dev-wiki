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
import type { Tutorial } from "@/types/tutorial";
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

function estimateReadTime(content?: string): string {
  if (!content) return "1 phút đọc";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} phút đọc`;
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
  tutorial: Tutorial;
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
  const readTime = estimateReadTime(tutorial.content);
  const viewCount = tutorial.views ?? 0;

  // Extract description from content (first 160 chars, strip markdown)
  const description = tutorial.content
    ? tutorial.content
        .replace(/[#*`\[\]()]/g, "")
        .replace(/\n+/g, " ")
        .trim()
        .slice(0, 160)
    : "";

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
          <span>{readTime}</span>
        </div>
      </div>

      {/* ─── Title ─── */}
      <h2 className="mb-2 line-clamp-2 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
        {tutorial.title}
      </h2>

      {/* ─── Description ─── */}
      {description && (
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {description}...
        </p>
      )}

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

      {/* ─── Footer: Author + Stats ─── */}
      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4">
        <Avatar className="h-6 w-6">
          <AvatarImage
            src={tutorial.authorAvatarUrl}
            alt={tutorial.authorName || "Author"}
          />
          <AvatarFallback className="text-[10px] font-medium">
            {getInitials(tutorial.authorName)}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-xs font-medium text-foreground">
          {tutorial.authorName || "Anonymous"}
        </span>

        {/* Stats - subtle, right-aligned */}
        <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
          {viewCount > 0 && (
            <span className="flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {viewCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
