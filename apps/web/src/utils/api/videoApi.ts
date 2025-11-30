import { api } from "@/lib/api";
import { Video, UpdateVideoRequest, CreateVideoRequest } from "@/types/video";
import { Tag } from "@/types/tag";

export async function createVideo(data: CreateVideoRequest): Promise<Video> {
  const res = await api.post<Video>("/videos", data);
  return res.data;
}

export async function getAllVideos(): Promise<Video[]> {
  const res = await api.get<Video[]>("/videos");
  return res.data;
}

export async function getVideoById(id: number): Promise<Video> {
  const res = await api.get<Video>(`/videos/${id}`);
  return res.data;
}

export async function getVideoByYoutubeId(youtubeId: string): Promise<Video> {
  const res = await api.get<Video>(`/videos/youtube/${youtubeId}`);
  return res.data;
}

export async function getVideosByUploader(
  uploaderId: number,
): Promise<Video[]> {
  const res = await api.get<Video[]>(`/videos/uploader/${uploaderId}`);
  return res.data;
}

export async function updateVideo(
  id: number,
  data: UpdateVideoRequest,
): Promise<Video> {
  const res = await api.patch<Video>(`/videos/${id}`, data);
  return res.data;
}

export async function deleteVideo(id: number): Promise<void> {
  await api.delete(`/videos/${id}`);
}

export async function upsertVideoTags(
  videoId: number,
  tagIds: number[],
): Promise<{ success: boolean }> {
  const res = await api.patch<{ success: boolean }>(`/videos/${videoId}/tags`, {
    tagIds,
  });
  return res.data;
}

export async function getVideoTags(videoId: number): Promise<Tag[]> {
  const res = await api.get<Tag[]>(`/videos/${videoId}/tags`);
  return res.data;
}

export async function linkVideoTag(
  videoId: number,
  tagId: number,
): Promise<Tag[]> {
  const res = await api.post<Tag[]>(`/videos/${videoId}/tags`, { tagId });
  return res.data;
}

export async function unlinkVideoTag(
  videoId: number,
  tagId: number,
): Promise<void> {
  await api.delete(`/videos/${videoId}/tags/${tagId}`);
}

export async function getVideosByTag(tagId: number): Promise<Video[]> {
  const res = await api.get<Video[]>(`/videos/tag/${tagId}`);
  return res.data;
}

export async function getVideosByTagName(tagName: string): Promise<Video[]> {
  const res = await api.get<Video[]>(
    `/videos/tag-name/${encodeURIComponent(tagName)}`,
  );
  return res.data;
}
