import { api } from "@/lib/api";
import {
  Tutorial,
  TutorialListItem,
  TutorialDetail,
  CreateTutorialRequest,
  UpdateTutorialRequest,
} from "@/types/tutorial";
import { Tag } from "@/types/tag";

/**
 * Get all tutorials (list view)
 * GET /tutorials
 */
export async function getAllTutorials(): Promise<TutorialListItem[]> {
  const res = await api.get<TutorialListItem[]>("/tutorials");
  return res.data;
}

/**
 * Get a tutorial by ID (detail view)
 * GET /tutorials/:id
 */
export async function getTutorialById(id: number): Promise<TutorialDetail> {
  const res = await api.get<TutorialDetail>(`/tutorials/${id}`);
  return res.data;
}

/**
 * Get a tutorial by slug (detail view)
 * GET /tutorials/slug/:slug
 */
export async function getTutorialBySlug(slug: string): Promise<TutorialDetail> {
  const res = await api.get<TutorialDetail>(`/tutorials/slug/${slug}`);
  return res.data;
}

/**
 * Create a new tutorial
 * POST /tutorials
 * Requires X-User-ID header
 */
export async function createTutorial(
  data: CreateTutorialRequest,
  userId: number,
): Promise<TutorialDetail> {
  const body = {
    title: data.title,
    content: data.content,
  };
  const res = await api.post<TutorialDetail>("/tutorials", body, {
    headers: { "X-User-ID": userId.toString() },
  });
  return res.data;
}

/**
 * Update a tutorial
 * PATCH /tutorials/:id
 * Requires X-User-ID header
 */
export async function updateTutorial(
  id: number,
  data: UpdateTutorialRequest,
  userId?: number,
): Promise<TutorialDetail> {
  const headers = userId ? { "X-User-ID": userId.toString() } : {};
  const res = await api.patch<TutorialDetail>(`/tutorials/${id}`, data, {
    headers,
  });
  return res.data;
}

/**
 * Delete a tutorial
 * DELETE /tutorials/:id
 * Requires X-User-ID header
 */
export async function deleteTutorial(
  id: number,
  userId?: number,
): Promise<void> {
  const headers = userId ? { "X-User-ID": userId.toString() } : {};
  await api.delete(`/tutorials/${id}`, { headers });
}

// ==================== Tutorial Tags (NOT YET IMPLEMENTED IN API_GO) ====================
// These functions are stubs for backward compatibility.
// Tutorial tags are included in TutorialDetail response from getTutorialById/getTutorialBySlug.
// Consider using those instead of fetching tags separately.

/**
 * @deprecated Use getTutorialById().tags instead - tags are now included in TutorialDetail
 * Get tags for a tutorial
 */
export async function getTutorialTags(tutorialId: number): Promise<Tag[]> {
  console.warn(
    "[tutorialApi] getTutorialTags is deprecated. Use getTutorialById().tags instead.",
  );
  // Fetch the full tutorial and return its tags
  try {
    const tutorial = await getTutorialById(tutorialId);
    return tutorial.tags || [];
  } catch {
    return [];
  }
}

/**
 * @deprecated Tutorial-tags endpoints are not yet implemented in api_go
 * Upsert tags for a tutorial
 */
export async function upsertTutorialTags(
  _tutorialId: number,
  _tagIds: number[],
): Promise<{ success: boolean }> {
  console.warn(
    "[tutorialApi] upsertTutorialTags is not yet implemented in api_go backend.",
  );
  // TODO: Implement when tutorial-tags module is added to api_go
  return { success: false };
}

/**
 * @deprecated Tutorial-tags endpoints are not yet implemented in api_go
 * Get tutorials by tag name
 */
export async function getTutorialsByTagName(
  _tagName: string,
): Promise<TutorialListItem[]> {
  console.warn(
    "[tutorialApi] getTutorialsByTagName is not yet implemented in api_go backend.",
  );
  // TODO: Implement when tutorial-tags module is added to api_go
  return [];
}
