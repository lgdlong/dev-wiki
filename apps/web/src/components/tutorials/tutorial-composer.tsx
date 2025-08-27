"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createTutorial } from "@/utils/api/tutorialApi";
import { useRouter } from "next/navigation";
import { Toast } from "../ui/announce-success-toast";

// Dynamic import with no SSR to prevent Element undefined error
const ToastEditor = dynamic(
  () => import("@/components/tutorials/tutorial-markdown"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] rounded-xl border border-white/10 bg-white/5 animate-pulse" />
    ),
  },
);

type TabKey = "text" | "media" | "link" | "poll" | "ama";
const TABS: { key: TabKey; label: string }[] = [
  { key: "text", label: "Text" },
  { key: "media", label: "Images & Video" },
  { key: "link", label: "Link" },
  { key: "poll", label: "Poll" },
  { key: "ama", label: "AMA" },
];

const TITLE_MAX = 100;
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

export default function TutorialComposer() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Markdown từ ToastEditor
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Tag picker
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const filteredSuggestions = useMemo(() => {
    const q = tagQuery.trim().toLowerCase();
    const base = TAG_SUGGESTIONS.filter((t) => !tags.includes(t));
    return q ? base.filter((t) => t.includes(q)) : base;
  }, [tagQuery, tags]);

  const canPost = useMemo(
    () =>
      tab === "text" &&
      Boolean(title.trim()) &&
      title.trim().length <= TITLE_MAX &&
      Boolean(content.trim()),
    [tab, title, content],
  );

  const addTag = (t: string) => {
    const v = t.trim();
    if (!v || tags.includes(v)) return;
    setTags((prev) => [...prev, v]);
    setTagQuery("");
  };
  const removeTag = (t: string) =>
    setTags((prev) => prev.filter((x) => x !== t));

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!pickerOpen) return;
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node))
        setPickerOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [pickerOpen]);

  // Viết chức năng của nút bấm (handle button)
  const onSaveDraft = () => alert("Draft saved (mock)");
  const onPost = async () => {
    if (!canPost || submitting) return;
    setSubmitting(true);

    try {
      const created = await createTutorial({
        // POST /tutorials
        title: title.trim(),
        content: content.trim(),
        tags,
      });
      console.log(created);

      // UX tuỳ bạn: reset hoặc điều hướng
      setTitle("");
      setContent("");
      setTags([]);

      // Hiện toast thành công
      setToastMsg("Tutorial published successfully!");
      setToastOpen(true);

      // Điều hướng sang trang quản trị/chi tiết bài
      //router.push(`/mod`); // hoặc `/tutorials/${(e as any)?.id ?? ''}` nếu có route chi tiết
    } catch (e: unknown) {
      //**********************DEBUG HERE********************** */
      // let msg = 'Publish failed';
      // if (e && typeof e === 'object' && 'message' in e && typeof (e as any).message === 'string') {

      //   msg = (e as { message: string }).message;
      // } else if (e instanceof Error) {
      //   msg = e.message;
      // }
      //alert(`Lỗi: ${msg}`);
      //**************************************************************************** */

      // Có thể show banner đỏ (phần 2) hoặc toast error luôn
      setToastMsg("An error occurred");
      setToastOpen(true);
    } finally {
      setSubmitting(false);
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
              className={`-mb-px border-b-2 px-2 py-2 text-sm font-medium transition
                ${tab === t.key ? "border-white text-white" : "border-transparent text-white/60 hover:text-white"}`}
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
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
            placeholder="Title"
            className="w-full h-8 rounded-xl border border-white/15 bg-black p-4 text-lg text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/15"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-xs text-white/50">
            {title.length}/{TITLE_MAX}
          </span>
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

        {/* TOAST UI Editor (Markdown core) */}
        {tab === "text" ? (
          <div className="w-full h-[60dvh] md:h-[70vh] xl:h-[75vh]">
            <ToastEditor value={content} onChange={setContent} height="100%" />
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 p-6 text-white/60">
            {`"${TABS.find((x) => x.key === tab)?.label}"`} editor coming soon…
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onSaveDraft}
          className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-white hover:bg-white/15"
        >
          Save Draft
        </button>
        <button
          disabled={!canPost || submitting} // <-- KHOÁ KHI SUBMITTING
          onClick={onPost}
          className="rounded-2xl bg-white px-4 py-2 font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Posting…" : "Post"} {/* <-- UX nhỏ */}
        </button>
      </div>

      {/* RENDER TOAST  */}
      <Toast
        open={toastOpen}
        message={toastMsg}
        kind={toastMsg.includes("success") ? "success" : "error"}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
