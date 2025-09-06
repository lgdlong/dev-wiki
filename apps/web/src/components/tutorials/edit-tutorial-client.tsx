"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Toast } from "@/components/ui/announce-success-toast";
import {
  getTutorialById,
  getTutorialTags,
  updateTutorial,
  upsertTutorialTags,
} from "@/utils/api/tutorialApi";
import TagPicker from "@/components/tags/tutorial/TagPicker";
import type { Tag } from "@/types/tag";

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

export default function EditTutorialClient({ id }: { id: number }) {
  // ===== UI State =====
  const [tab, setTab] = useState<TabKey>("text");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [initialTitle, setInitialTitle] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [initialTags, setInitialTags] = useState<Tag[]>([]);

  // ===== Load tutorial =====
  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const [t, tagList] = await Promise.all([
          getTutorialById(id),
          getTutorialTags(id), // ⬅️ lấy tags từ BE
        ]);
        if (!alive) return;

        const safeTags = Array.isArray(tagList) ? tagList : [];

        setTitle(t?.title ?? "");
        setContent(t?.content ?? "");
        setTags(Array.isArray(tagList) ? tagList : []); // tagList: Tag[]

        // set initial values
        setInitialTitle(t?.title ?? "");
        setInitialContent(t?.content ?? "");
        setInitialTags(safeTags);
      } catch {
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

  // ===== Actions (giống Create) =====
  const canUpdate =
    title.trim().length > 0 && content.trim().length > 0 && !saving;

  const onUpdate = async () => {
    if (!canUpdate) return;
    setSaving(true);
    try {
      await updateTutorial(id, {
        title: title.trim(),
        content: content.trim(),
      });

      const tagIds = Array.from(new Set(tags.map((t) => t.id))); // unique
      // Gọi upsert để replace toàn bộ liên kết tags của tutorial
      await upsertTutorialTags(id, tagIds);

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

  // =================dirty status========================
  const dirty = useMemo(() => {
    if (title.trim() !== initialTitle.trim()) return true;
    if (content.trim() !== initialContent.trim()) return true;
    // so sánh tags theo id
    const currentIds = tags.map((t) => t.id).sort();
    const initialIds = initialTags.map((t) => t.id).sort();
    if (currentIds.length !== initialIds.length) return true;
    for (let i = 0; i < currentIds.length; i++) {
      if (currentIds[i] !== initialIds[i]) return true;
    }
    return false;
  }, [title, content, tags, initialTitle, initialContent, initialTags]);

  //================want leave page?===========================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        const message = "You have unsaved changes. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dirty]);

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

        {/* Tags (dùng TagPicker + chips hiển thị bên ngoài) */}
        <div className="mb-4 space-y-3">
          {/* chips hiển thị bên ngoài, có khoảng cách */}
          {!!tags.length && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t.id}
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
                </span>
              ))}
            </div>
          )}

          {/* popover chọn tag; closeOnPick=false để chọn liên tục */}
          <TagPicker value={tags} onChange={setTags} closeOnPick={false} />
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
          disabled={!canUpdate || saving || !dirty}
          onClick={onUpdate}
          className="rounded-2xl bg-white px-4 py-2 font-medium text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Updating…" : dirty ? "Update" : "No changes"}
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
