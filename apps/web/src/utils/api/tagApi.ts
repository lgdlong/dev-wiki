// apps/web/src/utils/api/tagApi.ts
import { api } from "@/lib/api";
import {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  TagSearchResult,
} from "@/types/tag";

const BASE = "/tags";

/**
 * Create a new tag
 * POST /tags
 */
export async function createTag(data: CreateTagRequest): Promise<Tag> {
  const res = await api.post<Tag>(BASE, data);
  return res.data;
}

/**
 * Get all tags
 * GET /tags
 */
export async function getAllTags(): Promise<Tag[]> {
  const res = await api.get<Tag[]>(BASE);
  return res.data;
}

/**
 * Search tags by prefix
 * GET /tags/search?q=&limit=&cursor=&minChars=
 */
export async function searchTags(
  q: string,
  limit = 10,
  cursor?: string,
  minChars?: number,
): Promise<TagSearchResult> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  if (minChars) params.set("minChars", String(minChars));
  const res = await api.get<TagSearchResult>(
    `${BASE}/search?${params.toString()}`,
  );
  return res.data;
}

/**
 * Get a tag by ID
 * GET /tags/:id
 */
export async function getTagById(id: number): Promise<Tag> {
  const res = await api.get<Tag>(`${BASE}/${id}`);
  return res.data;
}

/**
 * Get a tag by name
 * GET /tags/name/:name
 */
export async function getTagByName(name: string): Promise<Tag> {
  const res = await api.get<Tag>(`${BASE}/name/${encodeURIComponent(name)}`);
  return res.data;
}

/**
 * Update a tag
 * PATCH /tags/:id
 */
export async function updateTag(
  id: number,
  data: UpdateTagRequest,
): Promise<Tag> {
  const res = await api.patch<Tag>(`${BASE}/${id}`, data);
  return res.data;
}

/**
 * Delete a tag
 * DELETE /tags/:id
 */
export async function deleteTag(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}
