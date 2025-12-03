import { api } from "@/lib/api";
import { Video, UpdateVideoRequest, CreateVideoRequest } from "@/types/video";
import { Tag } from "@/types/tag";

/**
 * Create a new video
 * POST /videos
 */
export async function createVideo(data: CreateVideoRequest): Promise<Video> {
  const res = await api.post<Video>("/videos", data);
  return res.data;
}

/**
 * Get all videos
 * GET /videos
 */
export async function getAllVideos(): Promise<Video[]> {
  const res = await api.get<Video[]>("/videos");
  return res.data;
}

/**
 * Get a video by ID
 * GET /videos/:id
 */
export async function getVideoById(id: number): Promise<Video> {
  const res = await api.get<Video>(`/videos/${id}`);
  return res.data;
}

/**
 * Get a video by YouTube ID
 * GET /videos/youtube/:youtubeId
 */
export async function getVideoByYoutubeId(youtubeId: string): Promise<Video> {
  const res = await api.get<Video>(`/videos/youtube/${youtubeId}`);
  return res.data;
}

/**
 * Get videos by uploader
 * GET /videos/uploader/:uploaderId
 */
export async function getVideosByUploader(
  uploaderId: number,
): Promise<Video[]> {
  const res = await api.get<Video[]>(`/videos/uploader/${uploaderId}`);
  return res.data;
}

/**
 * Get videos by tag ID
 * GET /videos/tag/:tagId
 */
export async function getVideosByTag(tagId: number): Promise<Video[]> {
  const res = await api.get<Video[]>(`/videos/tag/${tagId}`);
  return res.data;
}

/**
 * Get videos by tag name
 * GET /videos/tag-name/:tagName
 */
export async function getVideosByTagName(tagName: string): Promise<Video[]> {
  const res = await api.get<Video[]>(
    `/videos/tag-name/${encodeURIComponent(tagName)}`,
  );
  return res.data;
}

/**
 * Update a video
 * PATCH /videos/:id
 */
export async function updateVideo(
  id: number,
  data: UpdateVideoRequest,
): Promise<Video> {
  const res = await api.patch<Video>(`/videos/${id}`, data);
  return res.data;
}

/**
 * Delete a video
 * DELETE /videos/:id
 */
export async function deleteVideo(id: number): Promise<void> {
  await api.delete(`/videos/${id}`);
}

// ==================== Video-Tag Endpoints ====================

/**
 * Attach a tag to a video
 * POST /video-tags
 */
export async function attachVideoTag(
  videoId: number,
  tagId: number,
  userId?: number,
): Promise<{ id: number; videoId: number; tagId: number; createdAt: string }> {
  const headers = userId ? { "X-User-ID": userId.toString() } : {};
  const res = await api.post<{
    id: number;
    videoId: number;
    tagId: number;
    createdAt: string;
  }>("/video-tags", { videoId, tagId }, { headers });
  return res.data;
}

/**
 * Detach a tag from a video
 * DELETE /video-tags/:videoId/:tagId
 */
export async function detachVideoTag(
  videoId: number,
  tagId: number,
): Promise<void> {
  await api.delete(`/video-tags/${videoId}/${tagId}`);
}

/**
 * Update all tags for a video (upsert)
 * PATCH /videos/:id/tags
 */
export async function upsertVideoTags(
  videoId: number,
  tagIds: number[],
  userId?: number,
): Promise<Tag[]> {
  const headers = userId ? { "X-User-ID": userId.toString() } : {};
  const res = await api.patch<Tag[]>(
    `/videos/${videoId}/tags`,
    { tagIds },
    { headers },
  );
  return res.data;
}

/**
 * Get all tags for a video
 * GET /videos/:id/tags
 */
export async function getVideoTags(videoId: number): Promise<Tag[]> {
  const res = await api.get<Tag[]>(`/videos/${videoId}/tags`);
  return res.data;
}

/**
 * Get all videos for a tag
 * GET /tags/:id/videos
 */
export async function getVideosByTagId(tagId: number): Promise<Video[]> {
  const res = await api.get<Video[]>(`/tags/${tagId}/videos`);
  return res.data;
}
