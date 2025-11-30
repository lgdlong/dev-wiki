import Link from "next/link";
import { useQuery as useTagQuery } from "@tanstack/react-query";
import type { Tag } from "@/types/tag";
import type { Tutorial } from "@/types/tutorial";
import { getTutorialTags } from "@/utils/api/tutorialApi";
import { Badge } from "@/components/ui/badge";

function formatDate(d: string | number | Date) {
  const DATE_FMT: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
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

export default function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const href = `/tutorials/${tutorial.slug}`;
  const dateStr = tutorial.createdAt
    ? formatDate(tutorial.createdAt as any)
    : null;
  const viewsStr = tutorial.views != null ? `${tutorial.views} views` : null;
  const readTimeStr = estimateReadTime(tutorial.content as any);

  // Fetch tags for this tutorial
  const { data: tags, isLoading: tagsLoading } = useTagQuery<Tag[]>({
    queryKey: ["tutorial-tags", tutorial.id],
    queryFn: () => getTutorialTags(tutorial.id),
  });

  return (
    <Link
      href={href}
      className="flex h-full flex-col p-6 bg-white shadow-sm transition-all duration-200 border-1 border-zinc-200 rounded-none hover:border-zinc-900 hover:shadow-lg group"
    >
      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-3">
        {dateStr && <span>{dateStr}</span>}
        {dateStr && readTimeStr && <span className="text-zinc-300">•</span>}
        {readTimeStr && <span>{readTimeStr}</span>}
      </div>

      <h2 className="text-base font-bold leading-snug mb-3 line-clamp-2 text-zinc-900 group-hover:text-blue-600 transition-colors">
        {tutorial.title}
      </h2>

      {/* Tags under h2 */}
      <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
        {tagsLoading ? (
          <span className="text-xs text-zinc-400">Đang tải tag...</span>
        ) : Array.isArray(tags) && tags.length > 0 ? (
          tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="text-[10px] font-normal px-2 py-0.5 rounded-full h-5 min-h-0"
            >
              {tag.name}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-zinc-400">Không có tag</span>
        )}
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <span className="text-zinc-500 font-medium">{viewsStr}</span>
        <span className="font-semibold text-zinc-900 group-hover:translate-x-1 transition-transform inline-flex items-center">
          Read more
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
