// Create a new tag
import { api } from "@/lib/api";
import { CreateTagRequest, Tag } from "@/types/tag";

const BASE = "/tags";

/**
 * Create a new tag
 * POST /tags
 * @param data
 * @return Promise<Tag>
 */
export async function createTag(data: CreateTagRequest): Promise<Tag> {
  const res = await api.post<Tag>(BASE, data);
  return res.data;
}

/**
 * Get all tags
 * GET /tags
 * @return Promise<Tag[]>
 */
export async function getAllTags(): Promise<Tag[]> {
  const res = await api.get<Tag[]>(BASE);
  return res.data;
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
  const res = await api.get<{ items: Tag[]; nextCursor: string | null }>(
    `${BASE}/search?${params.toString()}`,
  );
  return res.data;
}

/**
 * Get a tag by ID
 * GET /tags/:id
 * @param id
 * @return Promise<Tag>
 */
export async function getTagById(id: number): Promise<Tag> {
  const res = await api.get<Tag>(`${BASE}/${id}`);
  return res.data;
}

/**
 * Get a tag by name
 * GET /tags/name/:name
 * @param name
 * @return Promise<Tag>
 */
export async function getTagByName(name: string): Promise<Tag> {
  const res = await api.get<Tag>(`${BASE}/name/${name}`);
  return res.data;
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
  const res = await api.patch<Tag>(`${BASE}/${id}`, data);
  return res.data;
}

/**
 * Delete a tag
 * DELETE /tags/:id
 * @param id
 */
export async function deleteTag(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}
