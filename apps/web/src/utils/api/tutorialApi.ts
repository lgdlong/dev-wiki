import { api } from "@/lib/api";
import {
  Tutorial,
  CreateTutorialRequest,
  UpdateTutorialRequest,
} from "@/types/tutorial";
import { Tag } from "@/types/tag";

export async function getAllTutorials(): Promise<Tutorial[]> {
  const res = await api.get<Tutorial[]>("/tutorials");
  return res.data;
}

export async function getTutorialById(id: number): Promise<Tutorial> {
  const res = await api.get<Tutorial>(`/tutorials/${id}`);
  return res.data;
}

export async function getTutorialsByAuthor(
  authorId: number,
): Promise<Tutorial[]> {
  const res = await api.get<Tutorial[]>(`/tutorials/author/${authorId}`);
  return res.data;
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial> {
  const res = await api.get<Tutorial>(`/tutorials/slug/${slug}`);
  return res.data;
}

export async function getTutorialPublishedById(id: number): Promise<Tutorial> {
  const res = await api.get<Tutorial>(`/tutorials/${id}/published`);
  return res.data;
}

export async function getTutorialPublishedBySlug(
  slug: string,
): Promise<Tutorial> {
  const res = await api.get<Tutorial>(`/tutorials/slug/${slug}/published`);
  return res.data;
}

export async function createTutorial(
  data: CreateTutorialRequest,
): Promise<Tutorial> {
  const body = {
    title: data.title,
    content: data.content,
  };
  const res = await api.post<Tutorial>("/tutorials", body);
  return res.data;
}

export async function updateTutorial(
  id: number,
  data: UpdateTutorialRequest,
): Promise<Tutorial> {
  const res = await api.patch<Tutorial>(`/tutorials/${id}`, data);
  return res.data;
}

export async function deleteTutorial(id: number): Promise<void> {
  await api.delete(`/tutorials/${id}`);
}

export async function upsertTutorialTags(
  tutorialId: number,
  tagIds: number[],
): Promise<{ success: boolean }> {
  const res = await api.patch<{ success: boolean }>(
    `/tutorial-tags/${tutorialId}/tags`,
    { tagIds },
  );
  return res.data;
}

export async function getTutorialTags(tutorialId: number): Promise<Tag[]> {
  const res = await api.get<Tag[]>(`/tutorial-tags/${tutorialId}/tags`);
  return res.data;
}
