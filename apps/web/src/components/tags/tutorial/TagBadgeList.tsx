"use client";

import { X } from "lucide-react";
import type { Tag } from "@/types/tag";

export function TagBadgeList({
  tags,
  onRemove,
}: {
  tags: Tag[];
  onRemove: (id: number) => void;
}) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2 px-3 pt-3">
      {tags.map((t) => (
        <span
          key={t.id}
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs"
        >
          #{t.name}
          <button
            type="button"
            onClick={() => onRemove(t.id)}
            className="text-white/70 hover:text-white"
            aria-label={`remove ${t.name}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
