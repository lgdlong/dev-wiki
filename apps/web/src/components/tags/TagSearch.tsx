"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tag } from "./TagBadgeList";
import { useTagSearch } from "@/hooks/useTagSearch";

type Props = {
  /** Ẩn các tag đã gắn sẵn vào video */
  linkedIds: number[];
  /** Chọn 1 tag trong gợi ý */
  onPick: (tag: Tag) => void;
  /** Tuỳ chọn: minChars, pageSize, debounceMs */
  minChars?: number;
  pageSize?: number;
  debounceMs?: number;
};

export default function TagSearch({
  linkedIds,
  onPick,
  minChars = 2,
  pageSize = 10,
  debounceMs = 250,
}: Props) {
  const { q, setQ, items, loading, nextCursor, loadMore, hasSearched } =
    useTagSearch({ minChars, pageSize, debounceMs });

  // Ẩn item đã được gắn
  const suggestions = useMemo(
    () => items.filter((t) => !linkedIds.includes(t.id)),
    [items, linkedIds],
  );

  // --- Keyboard navigation state ---
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // mở/đóng dropdown theo query
  useEffect(() => {
    const shouldOpen = q.trim().length >= minChars;
    setOpen(shouldOpen);
    setActiveIndex(-1); // reset khi query đổi
  }, [q, minChars]);

  // khi suggestions đổi, nếu index vượt quá thì reset
  useEffect(() => {
    if (activeIndex >= suggestions.length) {
      setActiveIndex(suggestions.length ? 0 : -1);
    }
  }, [suggestions.length, activeIndex]);

  // cuộn item đang active vào tầm nhìn
  useEffect(() => {
    if (activeIndex < 0) return;
    const el = itemRefs.current[activeIndex];
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const pickAt = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= suggestions.length) return;
      onPick(suggestions[idx]);
      setActiveIndex(-1);
      setOpen(false);
      setQ(""); // clear sau khi chọn
    },
    [suggestions, onPick, setQ],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    const count = suggestions.length;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (count === 0) return;
        setActiveIndex((prev) => {
          const next = prev < count - 1 ? prev + 1 : 0;
          return next;
        });
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (count === 0) return;
        setActiveIndex((prev) => {
          const next = prev > 0 ? prev - 1 : count - 1;
          return next;
        });
        break;
      }
      case "Home": {
        if (count === 0) return;
        e.preventDefault();
        setActiveIndex(0);
        break;
      }
      case "End": {
        if (count === 0) return;
        e.preventDefault();
        setActiveIndex(count - 1);
        break;
      }
      case "Enter": {
        if (activeIndex >= 0 && activeIndex < count) {
          e.preventDefault();
          pickAt(activeIndex);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type to search tags…"
            className="pl-8"
            role="combobox"
            aria-expanded={open}
            aria-controls="tag-suggest-list"
            aria-activedescendant={
              activeIndex >= 0
                ? `tag-opt-${suggestions[activeIndex]?.id}`
                : undefined
            }
            autoComplete="off"
          />
        </div>
        <Button type="button" variant="outline" onClick={() => setQ("")}>
          Clear
        </Button>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-10 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md"
          role="listbox"
        >
          {!hasSearched ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Type to search…
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {loading ? "Loading…" : "No matching tags"}
            </div>
          ) : (
            <>
              <ul
                id="tag-suggest-list"
                ref={listRef}
                className="max-h-56 overflow-auto py-1"
                role="listbox"
              >
                {suggestions.map((t, idx) => (
                  <li
                    key={t.id}
                    role="option"
                    aria-selected={activeIndex === idx}
                  >
                    <button
                      id={`tag-opt-${t.id}`}
                      ref={(el) => {
                        itemRefs.current[idx] = el;
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                        activeIndex === idx &&
                          "bg-accent text-accent-foreground",
                      )}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() =>
                        setActiveIndex((prev) => (prev === idx ? -1 : prev))
                      }
                      onClick={() => pickAt(idx)}
                    >
                      {t.name}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between px-3 py-2 border-t">
                <span className="text-xs text-muted-foreground">
                  {loading ? "Loading…" : `${suggestions.length} results`}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={loadMore}
                  disabled={!nextCursor || loading}
                >
                  More…
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
// return (
//   <div className="relative">
//     <div className="flex items-center gap-2">
//       <div className="relative flex-1">
//         <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//           onKeyDown={onKeyDown}
//           placeholder="Type to search tags…"
//           className="pl-8"
//           role="combobox"
//           aria-expanded={open}
//           aria-controls="tag-suggest-list"
//           aria-activedescendant={
//             activeIndex >= 0 ? `tag-opt-${suggestions[activeIndex]?.id}` : undefined
//           }
//           autoComplete="off"
//         />
//       </div>
//       <Button type="button" variant="outline" onClick={() => setQ("")}>
//         Clear
//       </Button>
//     </div>
//
//     {/* Dropdown */}
//     {q.trim().length >= minChars && (
//       <div className="absolute z-10 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
//         {!hasSearched ? (
//           <div className="px-3 py-2 text-sm text-muted-foreground">
//             Type to search…
//           </div>
//         ) : suggestions.length === 0 ? (
//           <div className="px-3 py-2 text-sm text-muted-foreground">
//             {loading ? "Loading…" : "No matching tags"}
//           </div>
//         ) : (
//           <>
//             <ul className="max-h-56 overflow-auto py-1">
//               {suggestions.map((t) => (
//                 <li key={t.id}>
//                   <button
//                     className={cn(
//                       "w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground",
//                     )}
//                     onClick={() => onPick(t)}
//                   >
//                     {t.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//
//             <div className="flex items-center justify-between px-3 py-2 border-t">
//               <span className="text-xs text-muted-foreground">
//                 {loading ? "Loading…" : `${suggestions.length} results`}
//               </span>
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={loadMore}
//                 disabled={!nextCursor || loading}
//               >
//                 More…
//               </Button>
//             </div>
//           </>
//         )}
//       </div>
//     )}
//   </div>
// );
