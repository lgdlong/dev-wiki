// @/components/tags/tutorial/TagPicker.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Nếu chưa có ScrollArea có thể thay bằng div overflow-auto
import type { Tag } from "@/types/tag";
import { getAllTags, createTag } from "@/utils/api/tagApi";
import { ChevronDown } from "lucide-react";
import { TagSearchBox } from "./TagSearchBox";
import { TagSuggestionList } from "./TagSuggestList";
import { TagCreateButton } from "./TagCreate";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function TagPicker({
  value,
  onChange,
  closeOnPick = false,
  width = 340,
  listMaxHeight = 240,
}: {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
  closeOnPick?: boolean;
  width?: number;
  listMaxHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const tags = await getAllTags();
        setAllTags(tags ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedIds = useMemo(() => new Set(value.map((t) => t.id)), [value]);
  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    return k
      ? allTags.filter((t) => t.name.toLowerCase().includes(k))
      : allTags;
  }, [q, allTags]);

  const canCreate =
    q.trim().length >= 2 &&
    /^[a-zA-Z0-9\s-_]+$/.test(q.trim()) &&
    !allTags.some((t) => t.name.toLowerCase() === q.trim().toLowerCase());

  function toggle(tag: Tag) {
    if (selectedIds.has(tag.id)) {
      onChange(value.filter((x) => x.id !== tag.id));
    } else {
      onChange([...value, tag]);
      if (closeOnPick) setOpen(false);
    }
  }

  async function handleCreate() {
    if (!canCreate || creating) return;
    setCreating(true);
    try {
      const newTag = await createTag({ name: q.trim() });
      setAllTags((prev) => [newTag, ...prev]);
      onChange([...value, newTag]);
      setQ("");
      if (closeOnPick) setOpen(false);
    } finally {
      setCreating(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className="rounded-full px-3 py-1.5 text-sm"
        >
          Add tags
          <ChevronDown className="ml-1 h-4 w-4 opacity-80" />
          {value.length > 0 && (
            <span className="ml-2 rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-700">
              {value.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        className="p-0 border-zinc-200 bg-white text-zinc-900"
        style={{ width }}
      >
        {/* Search */}
        <div className="p-2">
          <TagSearchBox
            value={q}
            onChange={setQ}
            onEnter={handleCreate}
            onEsc={() => setOpen(false)}
            autoFocus
          />
        </div>

        {/* Suggestions */}
        <div className="px-2">
          <Card className="border-zinc-200 bg-white">
            <div
              className="w-full overflow-auto"
              style={{ maxHeight: listMaxHeight }}
            >
              {loading ? (
                <div className="space-y-2 p-3">
                  <div className="h-6 w-32 animate-pulse rounded bg-zinc-200" />
                  <div className="h-6 w-40 animate-pulse rounded bg-zinc-200" />
                </div>
              ) : (
                <TagSuggestionList
                  tags={filtered}
                  selectedIds={selectedIds}
                  onToggle={toggle}
                />
              )}
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-3">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-xl border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <TagCreateButton
            canCreate={!!canCreate}
            creating={creating}
            onCreate={handleCreate}
            name={q}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
