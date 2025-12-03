// apps/web/src/types/video.ts

// Response DTO (matches VideoResponseDTO in api_go)
export interface Video {
  id: number;
  youtubeId: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  duration?: number | null;
  uploaderId?: number | null;
  channelTitle?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

// Request DTO for creating a video (matches CreateVideoDTO in api_go)
export interface CreateVideoRequest {
  youtubeId: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
  uploaderId?: number;
  channelTitle?: string;
  metadata?: Record<string, unknown>;
}

// Request DTO for updating a video (matches UpdateVideoDTO in api_go)
export interface UpdateVideoRequest {
  youtubeId?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
  uploaderId?: number;
  channelTitle?: string;
  metadata?: Record<string, unknown>;
}

// Video-Tag Response DTO (matches VideoTagResponseDTO in api_go)
export interface VideoTag {
  id: number;
  videoId: number;
  tagId: number;
  createdAt: string;
  createdBy?: number;
}
