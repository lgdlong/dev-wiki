import { api } from "@/lib/api";
import {
  Tutorial,
  CreateTutorialRequest,
  UpdateTutorialRequest,
} from "@/types/tutorial";
import { Tag } from "@/types/tag";
import { getAuthHeaders } from "@/utils/auth";

// ========== GET API ==========
/**
 * Get all tutorials
 * GET /tutorials
 */
export async function getAllTutorials(): Promise<Tutorial[]> {
  const res = await api.get<Tutorial[]>("/tutorials");
  return res.data;
}

/**
 * Get a tutorial by ID
 * GET /tutorials/:id
 */
export async function getTutorialById(id: number): Promise<Tutorial> {
  const res = await api.get<Tutorial>(`/tutorials/${id}`);
  return res.data;
}

/**
 * Get tutorials by author
 * GET /tutorials/author/:authorId
 */
export async function getTutorialsByAuthor(
  authorId: number,
): Promise<Tutorial[]> {
  const res = await api.get<Tutorial[]>(`/tutorials/author/${authorId}`);
  return res.data;
}

/**
 * Get a tutorial by slug
 * GET /tutorials/slug/:slug
 */
export async function getTutorialBySlug(slug: string): Promise<Tutorial> {
  const res = await api.get<Tutorial>(`/tutorials/slug/${slug}`);
  return res.data;
}

/**
 * Get a published tutorial by ID
 * GET /tutorials/:id/published
 */
export async function getTutorialPublishedById(id: number): Promise<Tutorial> {
  const res = await api.get<Tutorial>(`/tutorials/${id}/published`);
  return res.data;
}

/**
 * Get a published tutorial by slug
 * GET /tutorials/slug/:slug/published
 */
export async function getTutorialPublishedBySlug(
  slug: string,
): Promise<Tutorial> {
  const res = await api.get<Tutorial>(`/tutorials/slug/${slug}/published`);
  return res.data;
}

// ========== POST, PATCH, DELETE API ==========
/**
 * Create a new tutorial
 * POST /tutorials
 */
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

/**
 * Update a tutorial
 * PATCH /tutorials/:id
 */
export async function updateTutorial(
  id: number,
  data: UpdateTutorialRequest,
): Promise<Tutorial> {
  const res = await api.patch<Tutorial>(`/tutorials/${id}`, data);
  return res.data;
}

/**
 * Delete a tutorial
 * DELETE /tutorials/:id
 */
export async function deleteTutorial(id: number): Promise<void> {
  await api.delete(`/tutorials/${id}`);
}

/**
 * Upsert tutorial tags (requires auth)
 * PATCH /tutorials/:id/tags
 */
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

/**
 * Get tutorial tags (requires auth if your BE enforces it)
 * GET /tutorials/:id/tags
 */
export async function getTutorialTags(tutorialId: number): Promise<Tag[]> {
  const res = await api.get<Tag[]>(`/tutorial-tags/${tutorialId}/tags`);
  return res.data;
}
