// apps/web/src/components/tutorials/edit-tutorial-client.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Toast } from "@/components/ui/announce-success-toast";
import { getTutorialById, updateTutorial } from "@/utils/api/tutorialApi";

const ToastEditor = dynamic(
  () => import("@/components/tutorials/tutorial-markdown"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[60dvh] md:h-[70vh] xl:h-[75vh] rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
    ),
  },
);

// ===== Constants / Tabs (match Create) =====
const TITLE_MAX = 300;

type TabKey = "text" | "media" | "link" | "poll" | "ama";
const TABS: { key: TabKey; label: string }[] = [
  { key: "text", label: "Text" },
  { key: "media", label: "Images & Video" },
  { key: "link", label: "Link" },
  { key: "poll", label: "Poll" },
  { key: "ama", label: "AMA" },
];

const TAG_SUGGESTIONS = [
  "announcement",
  "tips",
  "qa",
  "release",
  "bug",
  "feature",
  "guide",
  "howto",
  "performance",
  "security",
  "design",
];

export default function EditTutorialClient({ id }: { id: number }) {
  // ===== UI State =====
  const [tab, setTab] = useState<TabKey>("text");
  const [loading, setLoading] = useState(true); // skeleton-first; will be turned off on mount
  const [saving, setSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Tag picker state/refs
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  // ===== Skeleton only: no API calls (just flip loading off on mount) =====
  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const t = await getTutorialById(id);
        if (!alive) return;
        setTitle(t.title ?? "");
        setContent(t.content ?? "");
        // nếu có tags ở BE:
        // setTags(t.tags ?? []);
      } catch (e) {
        setToastMsg("Failed to load tutorial");
        setToastOpen(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // ===== Helpers for Tags =====
  const filteredSuggestions = useMemo(() => {
    const q = tagQuery.trim().toLowerCase();
    if (!q) return TAG_SUGGESTIONS.filter((t) => !tags.includes(t));
    return TAG_SUGGESTIONS.filter((t) => t.includes(q) && !tags.includes(t));
  }, [tagQuery, tags]);

  function addTag(t: string) {
    const v = t.trim().toLowerCase();
    if (!v) return;
    if (!tags.includes(v)) setTags((s) => [...s, v]);
    setTagQuery("");
  }
  function removeTag(t: string) {
    setTags((s) => s.filter((x) => x !== t));
  }

  // Click outside to close picker
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!pickerRef.current) return;
      const target = e.target as Node;
      if (!pickerRef.current.contains(target)) setPickerOpen(false);
    }
    if (pickerOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [pickerOpen]);

  // ===== Actions (skeleton only, no API) =====
  const canUpdate =
    title.trim().length > 0 && content.trim().length > 0 && !saving;

  const onSaveDraft = () => {
    setToastMsg("Saved draft (skeleton).");
    setToastOpen(true);
  };

  const onUpdate = async () => {
    if (!canUpdate) return;
    setSaving(true);
    try {
      await updateTutorial(id, {
        title: title.trim(),
        content: content.trim(),
        // nếu có tags: tags
      });
      setToastMsg("Update success");
      setToastOpen(true);

      // điều hướng tuỳ bạn:
      // router.push(`/mod/tutorials/${id}`);
    } catch (e) {
      setToastMsg("Update failed");
      setToastOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs (đen/trắng) */}
      <div className="border-b border-white/10">
        <div className="flex gap-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px border-b-2 px-2 py-2 text-sm font-medium transition ${
                tab === t.key
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Khung soạn: nền đen chữ trắng */}
      <div className="rounded-2xl border border-white/10 text-white sm:p-5">
        {/* Title */}
        <div className="relative mb-4">
          {loading ? (
            <div className="h-11 w-full rounded-xl bg-white/5 animate-pulse" />
          ) : (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
              placeholder="Title"
              className="w-full h-8 rounded-xl border border-white/15 bg-black p-4 text-lg text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/15"
            />
          )}
          {!loading && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-xs text-white/50">
              {title.length}/{TITLE_MAX}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="relative inline-block" ref={pickerRef}>
            <button
              type="button"
              onClick={() => {
                setPickerOpen((v) => !v);
                setTimeout(() => tagInputRef.current?.focus(), 0);
              }}
              className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
            >
              Add tags
            </button>

            {pickerOpen && (
              <div className="absolute z-20 mt-2 w-80 rounded-2xl border border-white/10 bg-neutral-900 p-3 shadow-xl">
                <div className="mb-2">
                  <input
                    ref={tagInputRef}
                    value={tagQuery}
                    onChange={(e) => setTagQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (tagQuery.trim()) addTag(tagQuery);
                      }
                      if (e.key === "Escape") setPickerOpen(false);
                    }}
                    placeholder="Search or add a tag…"
                    className="w-full rounded-lg border border-white/10 bg-black p-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>

                <div className="max-h-56 overflow-auto rounded-lg border border-white/5">
                  {filteredSuggestions.length ? (
                    <ul className="divide-y divide-white/5">
                      {filteredSuggestions.map((t) => (
                        <li key={t}>
                          <button
                            type="button"
                            onClick={() => addTag(t)}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-white/5"
                          >
                            <span>#{t}</span>
                            <span className="text-xs text-white/60">Add</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 text-sm text-white/60">
                      No suggestions. Press{" "}
                      <kbd className="rounded bg-white/10 px-1">Enter</kbd> to
                      add “{tagQuery.trim()}”.
                    </div>
                  )}
                </div>

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(false)}
                    className="rounded-xl border border-white/10 px-3 py-1.5 text-sm text-white/80 hover:bg-white/5"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (tagQuery.trim()) addTag(tagQuery);
                      setPickerOpen(false);
                    }}
                    className="rounded-xl bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
                  >
                    Add tag
                  </button>
                </div>
              </div>
            )}
          </div>

          {!!tags.length && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="text-white/70 hover:text-white"
                    aria-label={`remove ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Editor */}
        {tab === "text" ? (
          loading ? (
            <div className="h-[60dvh] md:h-[70vh] xl:h-[75vh] w-full rounded-2xl bg-white/5 animate-pulse" />
          ) : (
            <div className="w-full h-[60dvh] md:h-[70vh] xl:h-[75vh]">
              <ToastEditor
                value={content}
                onChange={setContent}
                height="100%"
              />
            </div>
          )
        ) : (
          <div className="rounded-xl border border-white/10 p-6 text-white/60">
            {`"${TABS.find((x) => x.key === tab)?.label}"`} editor coming soon…
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <button
          disabled={!canUpdate || saving}
          onClick={onUpdate}
          className="rounded-2xl bg-white px-4 py-2 font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Updating…" : "Update"}
        </button>
      </div>

      {/* Toast */}
      <Toast
        open={toastOpen}
        message={toastMsg}
        kind={toastMsg.includes("success") ? "success" : "info"}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
