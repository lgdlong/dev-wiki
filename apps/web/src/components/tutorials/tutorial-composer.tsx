"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createTutorial, upsertTutorialTags } from "@/utils/api/tutorialApi";
import { useRouter } from "next/navigation";
import { Toast } from "../ui/announce-success-toast";
import TagPicker from "@/components/tags/tutorial/TagPicker";
import type { Tag } from "@/types/tag";
import { AnimatePresence, motion } from "framer-motion";
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

export default function TutorialComposer() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // Markdown từ ToastEditor
  const [tags, setTags] = useState<Tag[]>([]); // ⬅️ đổi sang Tag[]
  const [submitting, setSubmitting] = useState(false);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const canPost = useMemo(
    () =>
      tab === "text" &&
      Boolean(title.trim()) &&
      title.trim().length <= TITLE_MAX &&
      Boolean(content.trim()),
    [tab, title, content],
  );

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
      });
      console.log(created);

      // 2) Upsert tags nếu có
    const tagIds = Array.from(new Set(tags.map(t => t.id))); // unique
    console.log(tagIds)
    
    if (tagIds.length > 0 || tags.length === 0) {
      // nếu cho phép clear tag khi rỗng, cứ gọi luôn (BE replace-all)
      await upsertTutorialTags(created.id, tagIds);
    }
   

      
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
          {/* giữ comment: counter bên phải */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-xs text-white/50">
            {title.length}/{TITLE_MAX}
          </span>
        </div>


        {/* chips ở ngoài popover */}
        {tags.length > 0 && (
          <AnimatePresence initial={false}>
            <div className="flex flex-wrap gap-2 m-3">
              {tags.map((t) => (
                <motion.span
                  key={t.id}
                  layout
                  initial={{ scale: 0.6, opacity: 0, y: -6 }}   // 👉 pop-in
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.6, opacity: 0, y: -6 }}      // 👉 pop-out khi remove
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm"
                >
                  #{t.name}
                  <button
                    type="button"
                    onClick={() =>
                      setTags((prev) => prev.filter((x) => x.id !== t.id))
                    }
                    className="text-white/70 hover:text-white"
                    aria-label={`remove ${t.name}`}
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
          </AnimatePresence>
        )}


        {/* Tags (dùng TagPicker) */}
        <div className="mb-4">
          <TagPicker value={tags} onChange={setTags} closeOnPick={false} />
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
