"use client";

import type { Tag } from "@/types/tag";
import { cn } from "@/lib/utils";

export function TagSuggestionList({
  tags,
  selectedIds,
  onToggle,
}: {
  tags: Tag[];
  selectedIds: Set<number>;
  onToggle: (t: Tag) => void;
}) {
  if (!tags.length) {
    return (
      <div className="p-3 text-sm text-white/60">
        No results. Press <kbd className="rounded bg-white/10 px-1">Enter</kbd> to create.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/5">
      {tags.map((t) => {
        const active = selectedIds.has(t.id);
        return (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onToggle(t)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm",
                active ? "bg-white/5" : "hover:bg-white/5",
              )}
            >
              <span className="truncate">#{t.name}</span>
              <span className="text-xs text-white/70">
                {active ? "Remove" : "Add"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
