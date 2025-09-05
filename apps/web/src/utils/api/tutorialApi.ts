import { fetcher } from "@/lib/fetcher";
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
  return fetcher<Tutorial[]>("/tutorials", { method: "GET" });
}

/**
 * Get a tutorial by ID
 * GET /tutorials/:id
 */
export async function getTutorialById(id: number): Promise<Tutorial> {
  return fetcher<Tutorial>(`/tutorials/${id}`, { method: "GET" });
}

/**
 * Get tutorials by author
 * GET /tutorials/author/:authorId
 */
export async function getTutorialsByAuthor(
  authorId: number,
): Promise<Tutorial[]> {
  return fetcher<Tutorial[]>(`/tutorials/author/${authorId}`, {
    method: "GET",
  });
}

/**
 * Get a tutorial by slug
 * GET /tutorials/slug/:slug
 */
export async function getTutorialBySlug(slug: string): Promise<Tutorial> {
  return fetcher<Tutorial>(`/tutorials/slug/${slug}`, { method: "GET" });
}

/**
 * Get tutorial tags (requires auth if your BE enforces it)
 * GET /tutorials/:id/tags
 */
export async function getTutorialTags(tutorialId: number): Promise<Tag[]> {
  return fetcher<Tag[]>(`/tutorials/${tutorialId}/tags`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

/**
 * Get a published tutorial by ID
 * GET /tutorials/:id/published
 */
export async function getTutorialPublishedById(id: number): Promise<Tutorial> {
  return fetcher<Tutorial>(`/tutorials/${id}/published`, { method: "GET" });
}

/**
 * Get a published tutorial by slug
 * GET /tutorials/slug/:slug/published
 */
export async function getTutorialPublishedBySlug(slug: string): Promise<Tutorial> {
  return fetcher<Tutorial>(`/tutorials/slug/${slug}/published`, { method: "GET" });
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
    // only include author_id if present; avoid NaN
    ...(data.author_id !== undefined && data.author_id !== null
      ? { author_id: Number(data.author_id) }
      : {}),
    tags: data.tags,
  };

  return fetcher<Tutorial>("/tutorials", {
    method: "POST",
    body: JSON.stringify(body),
    headers: getAuthHeaders(),
  });
}

/**
 * Update a tutorial
 * PATCH /tutorials/:id
 */
export async function updateTutorial(
  id: number,
  data: UpdateTutorialRequest,
): Promise<Tutorial> {
  return fetcher<Tutorial>(`/tutorials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: getAuthHeaders(),
  });
}

/**
 * Delete a tutorial
 * DELETE /tutorials/:id
 */
export async function deleteTutorial(id: number): Promise<void> {
  return fetcher<void>(`/tutorials/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

/**
 * Upsert tutorial tags (requires auth)
 * PATCH /tutorials/:id/tags
 */
export async function upsertTutorialTags(
  tutorialId: number,
  tagIds: number[],
): Promise<{ success: boolean }> {
  return fetcher<{ success: boolean }>(`/tutorials/${tutorialId}/tags`, {
    method: "PATCH",
    body: JSON.stringify({ tagIds }),
    headers: getAuthHeaders(),
  });
}
