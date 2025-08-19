import { fetcher } from "@/lib/fetcher";
import { Video, UpdateVideoRequest, CreateVideoRequest } from "@/types/video";
import { getAccessToken } from "@/utils/auth";
import { Tag } from "@/types/tag";

/**
 * Create a new videos
 * POST /videos
 * @param data
 * @returns Promise<Video>
 */
export async function createVideo(data: CreateVideoRequest): Promise<Video> {
  return fetcher<Video>("/videos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get all videos
 * GET /videos
 * @return Promise<Video[]>
 */
export async function getAllVideos(): Promise<Video[]> {
  return fetcher<Video[]>("/videos", {
    method: "GET",
  });
}

// Get a videos by ID
export async function getVideoById(id: number): Promise<Video> {
  return fetcher<Video>(`/videos/${id}`, {
    method: "GET",
  });
}

// Get a videos by YouTube ID
export async function getVideoByYoutubeId(youtubeId: string): Promise<Video> {
  return fetcher<Video>(`/videos/youtube/${youtubeId}`, {
    method: "GET",
  });
}

// Get videos by uploader
export async function getVideosByUploader(
  uploaderId: number,
): Promise<Video[]> {
  return fetcher<Video[]>(`/videos/uploader/${uploaderId}`, {
    method: "GET",
  });
}

// Update a videos
export async function updateVideo(
  id: number,
  data: UpdateVideoRequest,
): Promise<Video> {
  return fetcher<Video>(`/videos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a videos
 * DELETE /videos/:id
 * @param id
 * @returns Promise<void>
 */
export async function deleteVideo(id: number): Promise<void> {
  return fetcher<void>(`/videos/${id}`, {
    method: "DELETE",
  });
}

export async function upsertVideoTags(
  videoId: number,
  tagIds: number[],
): Promise<{ success: boolean }> {
  const token = getAccessToken();
  return fetcher<{ success: boolean }>(`/videos/${videoId}/tags`, {
    method: "PATCH",
    body: JSON.stringify({ tagIds }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

// @Get('videos/:id/tags')
export async function getVideoTags(videoId: number): Promise<Tag[]> {
  const token = getAccessToken();
  return fetcher<Tag[]>(`/videos/${videoId}/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
