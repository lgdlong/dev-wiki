"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getVideoById, getVideoTags, upsertVideoTags } from "@/utils/api/video";
import { createTag, getAllTags } from "@/utils/api/tag";
import type { Video } from "@/types/video";
import type { Tag } from "@/components/tags/TagBadgeList";

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
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

        setAllTags(all);
        setLinkedTags(linkedFromServer);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [videoId, router]);

  const addTag = (tag: Tag) => {
    setLinkedTags((prev) =>
      prev.some((t) => t.id === tag.id) ? prev : [...prev, tag],
    );
    setTagQuery("");
  };

  const removeTag = (tagId: number) => {
    setLinkedTags((prev) => prev.filter((t) => t.id !== tagId));
  };

  const handleCreateTag = async (tagName: string) => {
    if (!isValidTagName(tagName)) return; // chặn UI level
    setCreating(true);
    try {
      const exists = allTags.find((t) => t.name === tagName);
      if (exists) {
        addTag(exists);
        return;
      }
      const newTag = await createTag({ name: tagName }); // server sẽ validate lại
      setAllTags((prev) => [newTag, ...prev]);
      addTag(newTag);
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const linkedIds: number[] = linkedTags
        .map((t) => t.id)
        .sort((a, b) => a - b);
      await upsertVideoTags(videoId, linkedIds);

      // refresh linked tags từ server để đồng bộ UI
      const latestLinked: Tag[] = await getVideoTags(videoId);
      setLinkedTags(latestLinked);

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Add tags to video #{videoId}</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
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
