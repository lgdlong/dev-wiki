// apps/web/src/types/video.ts
export interface Video {
  id: number;
  youtubeId: string;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  duration?: number | null;
  uploader?: string | null;
  channelTitle?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string; // hoặc Date, nhưng thường backend trả về ISO string
}
