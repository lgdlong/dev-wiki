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
      <div className="p-3 text-sm text-zinc-500">
        No results. Press{" "}
        <kbd className="rounded bg-zinc-200 px-1 text-zinc-700">Enter</kbd> to
        create.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200">
      {tags.map((t) => {
        const active = selectedIds.has(t.id);
        return (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onToggle(t)}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2 text-left text-sm text-zinc-900",
                active ? "bg-zinc-100" : "hover:bg-zinc-50",
              )}
            >
              <span className="truncate">#{t.name}</span>
              <span className="text-xs text-zinc-500">
                {active ? "Remove" : "Add"}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
