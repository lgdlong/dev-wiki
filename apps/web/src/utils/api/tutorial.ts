import { fetcher } from "@/lib/fetcher";
import {
  Tutorial,
  CreateTutorialRequest,
  UpdateTutorialRequest,
} from "@/types/tutorial";
import { Tag } from "@/types/tag";
import { getAccessToken } from "@/utils/auth";

//function hàm authHeader
function authHeaders(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
}

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
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
}

/**
 * Delete a tutorial
 * DELETE /tutorials/:id
 */
export async function deleteTutorial(id: number): Promise<void> {
  const token = getAccessToken();
  return fetcher<void>(`/tutorials/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(),
    },
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
  const token = getAccessToken();
  return fetcher<{ success: boolean }>(`/tutorials/${tutorialId}/tags`, {
    method: "PATCH",
    body: JSON.stringify({ tagIds }),
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
}

/**
 * Get tutorial tags (requires auth if your BE enforces it)
 * GET /tutorials/:id/tags
 */
export async function getTutorialTags(tutorialId: number): Promise<Tag[]> {
  const token = getAccessToken();
  return fetcher<Tag[]>(`/tutorials/${tutorialId}/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
  });
}
