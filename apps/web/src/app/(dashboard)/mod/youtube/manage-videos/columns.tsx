// app/mod/youtube/manage-video/columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Video } from "@/types/video";

/** Định dạng thời lượng thành HH:MM:SS */
function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function makeVideoColumns({
  onEdit,
  onRequestDelete,
}: {
  onEdit: (id: number) => void;
  onRequestDelete: (id: number) => void;
}): ColumnDef<Video>[] {
  return [
    {
      accessorKey: "thumbnailUrl",
      header: "",
      cell: ({ row }) => {
        const v = row.original;
        const thumb =
          v.thumbnailUrl ||
          (v.youtubeId
            ? `https://i.ytimg.com/vi/${v.youtubeId}/mqdefault.jpg`
            : "");
        return (
          <div className="h-14 w-24 overflow-hidden rounded-md border bg-muted">
            {thumb ? (
              <Image
                src={thumb}
                alt={v.title ?? "thumbnail"}
                width={160}
                height={90}
                className="h-full w-full object-cover"
                unoptimized /* Nếu đã whitelist i.ytimg.com thì bỏ prop này */
              />
            ) : (
              <span className="text-muted-foreground text-xs">No image</span>
            )}
          </div>
        );
      },
      size: 120,
      enableSorting: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div className="max-w-[420px] truncate">
            <span className="font-medium">{v.title || "(Untitled)"}</span>
            {v.youtubeId ? (
              <div className="text-xs text-muted-foreground">
                YT: {v.youtubeId}
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "channelTitle",
      header: "Channel",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.channelTitle || "—"}</span>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => formatDuration(row.original.duration),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const d = row.original.createdAt
          ? new Date(row.original.createdAt)
          : null;
        return (
          <span className="text-sm text-muted-foreground">
            {d ? d.toLocaleString() : "—"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const v = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Edit video"
              onClick={() => onEdit(v.id as unknown as number)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              aria-label="Delete video"
              onClick={() => onRequestDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      size: 100,
      enableSorting: false,
    },
  ];
}
