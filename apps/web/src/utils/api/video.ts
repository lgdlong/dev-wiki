import { fetcher } from "@/lib/fetcher";
import { Video } from "@/types/video";

// Interface for creating a video
export interface CreateVideoRequest {
  youtubeId: string;
  uploader?: string;
}

// Interface for updating a video (partial Video without id and createdAt)
export interface UpdateVideoRequest {
  youtubeId?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number;
  uploader?: string;
  metadata?: Record<string, any>;
}

// Create a new video
export async function createVideo(data: CreateVideoRequest): Promise<Video> {
  return fetcher<Video>("/videos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get all videos
export async function getAllVideos(): Promise<Video[]> {
  return fetcher<Video[]>("/videos", {
    method: "GET",
  });
}

// Get a video by ID
export async function getVideoById(id: number): Promise<Video> {
  return fetcher<Video>(`/videos/${id}`, {
    method: "GET",
  });
}

// Get a video by YouTube ID
export async function getVideoByYoutubeId(youtubeId: string): Promise<Video> {
  return fetcher<Video>(`/videos/youtube/${youtubeId}`, {
    method: "GET",
  });
}

// Get videos by uploader
export async function getVideosByUploader(uploader: string): Promise<Video[]> {
  return fetcher<Video[]>(`/videos/uploader/${uploader}`, {
    method: "GET",
  });
}

// Update a video
export async function updateVideo(
  id: number,
  data: UpdateVideoRequest
): Promise<Video> {
  return fetcher<Video>(`/videos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Delete a video
export async function deleteVideo(id: number): Promise<void> {
  return fetcher<void>(`/videos/${id}`, {
    method: "DELETE",
  });
}
