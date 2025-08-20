// apps/web/src/types/videos.ts
export interface Video {
  id: number;
  youtubeId: string;
  title: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  duration: number | null;
  uploaderId?: number | null;
  channelTitle: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string; // hoặc Date, nhưng thường backend trả về ISO string
}

// Interface for creating a videos
export interface CreateVideoRequest {
  youtubeId: string;
  uploaderId?: number;
}

// Interface for updating a videos (partial Video without id and createdAt)
export interface UpdateVideoRequest {
  youtubeId?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
  uploaderId?: number;
  metadata?: Record<string, any>;
}
