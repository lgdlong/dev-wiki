"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration, getYoutubeThumbnail } from "@/utils/youtube";

type Props = {
  title?: string | null;
  youtubeId: string;
  channelTitle?: string | null;
  duration?: number | null; // seconds
  thumbnailUrl?: string | null;
};

export default function VideoInfoCard({
  title,
  youtubeId,
  channelTitle,
  duration,
  thumbnailUrl,
}: Props) {
  const thumb = thumbnailUrl || getYoutubeThumbnail(youtubeId, "mq");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Video info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnail */}
          <div className="w-full md:w-1/3">
            <div className="w-full max-w-[240px] overflow-hidden rounded-md border bg-muted">
              {thumb ? (
                <img
                  src={thumb}
                  alt={title ?? "thumbnail"}
                  className="rounded-md border w-full object-cover"
                />
              ) : (
                <span className="text-muted-foreground text-xs block p-2">
                  No image
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Title</span>
              <span className="font-medium line-clamp-2">{title}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem label="YouTube ID" value={youtubeId} />
              <InfoItem label="Channel" value={channelTitle ?? "—"} />
              <InfoItem
                label="Duration"
                value={String(formatDuration(duration) ?? "—")}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value || "—"}</span>
    </div>
  );
}
