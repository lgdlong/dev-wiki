// app/mod/youtube/manage-video/[id]/edit/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getVideoById, getVideoByYoutubeId } from "@/utils/api/video";
import { Video } from "@/types/video";

export default function EditVideoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [video, setVideo] = useState<Video>();

  // convert id to number
  const videoId = Number(id);
  if (isNaN(videoId)) {
    router.replace("/404");
    return null;
  }

  useEffect(() => {
    (async () => {
      const vid: Video = await getVideoById(videoId);
      if (vid) {
        setVideo(vid);
      } else
        router.replace("/404");
    })();
  }, [id, router]);

  if (!video) return <div className="p-6">Loading…</div>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Sửa video #{id}</h1>
      {/* form tương tự ví dụ server ở trên */}
    </main>
  );
}
