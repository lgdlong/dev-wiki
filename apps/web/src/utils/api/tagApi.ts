// Create a new tag
import { fetcher } from "@/lib/fetcher";
import { CreateTagRequest, Tag } from "@/types/tag";

const BASE = "/tags";

/**
 * Create a new tag
 * POST /tags
 * @param data
 * @return Promise<Tag>
 */
export async function createTag(data: CreateTagRequest): Promise<Tag> {
  return fetcher<Tag>(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get all tags
 * GET /tags
 * @return Promise<Tag[]>
 */
export async function getAllTags(): Promise<Tag[]> {
  return fetcher<Tag[]>(BASE, {
    method: "GET",
  });
}

export async function searchTags(
  q: string,
  limit = 10,
  cursor?: string,
): Promise<{
  items: Tag[];
  nextCursor: string | null;
}> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  return fetcher<{ items: Tag[]; nextCursor: string | null }>(
    `${BASE}/search?${params.toString()}`,
  );
}

/**
 * Get a tag by ID
 * GET /tags/:id
 * @param id
 * @return Promise<Tag>
 */
export async function getTagById(id: number): Promise<Tag> {
  return fetcher<Tag>(`${BASE}/${id}`, {
    method: "GET",
  });
}

/**
 * Get a tag by name
 * GET /tags/name/:name
 * @param name
 * @return Promise<Tag>
 */
export async function getTagByName(name: string): Promise<Tag> {
  return fetcher<Tag>(`${BASE}/name/${name}`, {
    method: "GET",
  });
}

/**
 * Update a tag
 * PATCH /tags/:id
 * @param id
 * @param data
 * @return Promise<Tag>
 */
export async function updateTag(
  id: number,
  data: CreateTagRequest,
): Promise<Tag> {
  return fetcher<Tag>(`${BASE}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * Update a tag
 * PATCH /tags/:id
 * @param id
 * @param data
 */
export async function deleteTag(id: number): Promise<void> {
  return fetcher<void>(`${BASE}/${id}`, {
    method: "DELETE",
  });
}
