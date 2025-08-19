"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { makeVideoColumns } from "./columns";
import type { Video } from "@/types/video";
import { getAllVideos, deleteVideo } from "@/utils/api/video";
import { Plus, RefreshCw } from "lucide-react";
import type { SortingState, ColumnDef } from "@tanstack/react-table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

const DEFAULT_SORT: SortingState = [{ id: "createdAt", desc: true }];

export default function ManageVideoPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  // state cho dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const data = await getAllVideos(); // fetch once, sort client-side
      setVideos(data ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return videos;
    const k = q.toLowerCase();
    return videos.filter((v) =>
      [v.title, v.channelTitle, v.youtubeId]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(k)),
    );
  }, [videos, q]);

  const columns: ColumnDef<Video>[] = useMemo(
    () =>
      makeVideoColumns({
        onEdit: (id: number) =>
          router.push(`/mod/youtube/manage-video/${id}/edit`),
        onRequestDelete: (id: number) => {
          setPendingId(id);
          setOpenDelete(true);
        },
      }),
    [router],
  );

  // Hàm xoá thực sự (gọi từ dialog)
  async function confirmDelete() {
    if (pendingId == null) return;
    await deleteVideo(pendingId);
    setVideos((prev) => prev.filter((x) => x.id !== pendingId));
    setPendingId(null);
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Manage YouTube Videos
          </h1>
          <p className="text-sm text-muted-foreground">
            View, edit and delete videos (Moderator).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => load()}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button asChild className="gap-2">
            <Link href="/mod/youtube/post-video">
              <Plus className="h-4 w-4" /> Add Video
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-3 pt-6">
          <Input
            placeholder="Search by title, channel or YouTube ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <div className="text-sm text-muted-foreground">
            Total <span className="font-medium">{filtered.length}</span> videos
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-24 animate-pulse rounded-md border bg-muted" />
      ) : err ? (
        <div className="rounded-md border p-3 text-red-600">{err}</div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          defaultSorting={DEFAULT_SORT}
        />
      )}

      <p className="text-xs text-muted-foreground">
        Tip: if you use <code>next/image</code> for YouTube thumbnails,
        whitelist <code>i.ytimg.com</code> in <code>next.config.js</code> (
        <code>images.remotePatterns</code>) or set <code>unoptimized</code>.
      </p>

      {/* Dialog xác nhận xoá (mobile-friendly) */}
      <DeleteConfirmDialog
        open={openDelete}
        onOpenChange={(v: boolean) => {
          setOpenDelete(v);
          if (!v) setPendingId(null);
        }}
        title="Delete this video?"
        description="This action cannot be undone. The video will be permanently removed."
        confirmText="Delete video"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
