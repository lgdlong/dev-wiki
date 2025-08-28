"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getVideoById,
  getVideoTags,
  upsertVideoTags,
} from "@/utils/api/videoApi";
import { createTag, getAllTags } from "@/utils/api/tagApi";
import type { Video } from "@/types/video";
import type { Tag } from "@/components/tags/TagBadgeList";

import { Button } from "@/components/ui/button";
import { Save, Loader2, ChevronLeft } from "lucide-react";
import TagManager from "@/components/tags/TagManager";
import VideoInfoCard from "@/components/videos/VideoInfoCard";
import { isValidTagName } from "@/utils/tag";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function EditVideoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();

  const [video, setVideo] = useState<Video>();
  const [loading, setLoading] = useState(true);

  // Tag state
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [linkedTags, setLinkedTags] = useState<Tag[]>([]);
  const [tagQuery, setTagQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // NEW: giữ snapshot ban đầu để so dirty
  const initialLinkedIdsRef = useRef<number[] | null>(null);

  const videoId: number = Number(id);
  if (isNaN(videoId)) {
    router.replace("/404");
    return null;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const vid = await getVideoById(videoId);
        if (!vid) {
          router.replace("/404");
          return;
        }
        if (!mounted) return;
        setVideo(vid);

        const [all, linkedFromServer] = await Promise.all([
          getAllTags(),
          getVideoTags(videoId),
        ]);
        if (!mounted) return;

        // sort ổn định theo name cho UX
        const sortByName = (xs: Tag[]) =>
          [...xs].sort((a, b) => a.name.localeCompare(b.name));

        setAllTags(sortByName(all));
        setLinkedTags(sortByName(linkedFromServer));
        initialLinkedIdsRef.current = linkedFromServer
          .map((t) => t.id)
          .sort((a, b) => a - b);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [videoId, router]);

  // helper: so sánh 2 mảng id đã sort (để check dirty)
  const idsOf = (tags: Tag[]) => tags.map((t) => t.id).sort((a, b) => a - b);
  const isSameIds = (a: number[] | null, b: number[]) => {
    if (!a) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  };

  // NEW: dirty state tính từ snapshot
  const dirty = useMemo(() => {
    const current = idsOf(linkedTags);
    return !isSameIds(initialLinkedIdsRef.current, current);
  }, [linkedTags]);

  // NEW: cảnh báo rời trang nếu dirty (batch)
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = ""; // Chrome cần chuỗi rỗng
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Batch mode: add/remove chỉ cập nhật state local (chưa gọi API)
  const addTag = (tag: Tag) => {
    setLinkedTags((prev) => {
      if (prev.some((t) => t.id === tag.id)) return prev;
      const next = [...prev, tag];
      next.sort((a, b) => a.name.localeCompare(b.name));
      return next;
    });
    setTagQuery("");
  };

  const removeTag = (tagId: number) => {
    setLinkedTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const handleCreateTag = async (tagName: string) => {
    if (!isValidTagName(tagName)) return; // chặn UI level
    setCreating(true);
    try {
      // hỗ trợ case-insensitive tìm sẵn trong allTags
      const norm = (s: string) => s.trim().toLowerCase();
      const exists =
        allTags.find((t) => norm(t.name) === norm(tagName)) ?? null;
      if (exists) {
        addTag(exists);
        return;
      }
      const newTag = await createTag({ name: tagName }); // server sẽ validate lại
      setAllTags((prev) => {
        const next = [newTag, ...prev];
        next.sort((a, b) => a.name.localeCompare(b.name));
        return next;
      });
      addTag(newTag);
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    // Batch: gửi toàn bộ id hiện tại lên BE
    if (!dirty) {
      toast.info("No changes to save");
      return;
    }
    setSaving(true);
    try {
      const linkedIds: number[] = linkedTags
        .map((t) => t.id)
        .sort((a, b) => a - b);
      await upsertVideoTags(videoId, linkedIds);

      // refresh linked tags từ server để đồng bộ UI
      const latestLinked: Tag[] = await getVideoTags(videoId);
      const sortByName = (xs: Tag[]) =>
        [...xs].sort((a, b) => a.name.localeCompare(b.name));
      setLinkedTags(sortByName(latestLinked));

      // NEW: cập nhật snapshot sau khi save thành công
      initialLinkedIdsRef.current = latestLinked
        .map((t) => t.id)
        .sort((a, b) => a - b);

      toast.success("Saved tags");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save tags");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !video) {
    return (
      <div className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <Button
        variant="outline"
        onClick={() => {
          // NEW: confirm khi back nếu dirty
          if (dirty) {
            const ok = window.confirm(
              "You have unsaved changes. Leave without saving?",
            );
            if (!ok) return;
          }
          router.back();
        }}
        disabled={saving}
      >
        <ChevronLeft />
        Back
      </Button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Add tags to video #{videoId}</h1>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving || !dirty}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save changes
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-row gap-5">
        <VideoInfoCard
          title={video.title}
          youtubeId={video.youtubeId}
          channelTitle={video.channelTitle}
          duration={video.duration}
          thumbnailUrl={video.thumbnailUrl}
        />

        <TagManager
          allTags={allTags}
          linkedTags={linkedTags}
          query={tagQuery}
          creating={creating}
          onQueryChange={setTagQuery}
          onAdd={addTag}
          onRemove={removeTag}
          onCreate={handleCreateTag}
        />
      </div>
    </main>
  );
}
