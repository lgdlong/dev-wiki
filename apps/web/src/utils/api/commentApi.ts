// apps/web/src/utils/api/commentApi.ts
import { api } from "@/lib/api";
import {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  EntityType,
} from "@/types/comment";

const BASE = "/comments";

/**
 * Create a new comment
 * POST /comments
 */
export async function createComment(
  data: CreateCommentRequest,
): Promise<Comment> {
  const res = await api.post<Comment>(BASE, data);
  return res.data;
}

/**
 * Get all comments
 * GET /comments
 */
export async function getAllComments(): Promise<Comment[]> {
  const res = await api.get<Comment[]>(BASE);
  return res.data;
}

/**
 * Get a comment by ID
 * GET /comments/:id
 */
export async function getCommentById(id: number): Promise<Comment> {
  const res = await api.get<Comment>(`${BASE}/${id}`);
  return res.data;
}

/**
 * Get comments by entity (video, tutorial, etc.)
 * GET /comments/entity/:entityType/:entityId
 */
export async function getCommentsByEntity(
  entityType: EntityType,
  entityId: number,
): Promise<Comment[]> {
  const res = await api.get<Comment[]>(
    `${BASE}/entity/${entityType}/${entityId}`,
  );
  return res.data;
}

/**
 * Get comments by author
 * GET /comments/author/:authorId
 */
export async function getCommentsByAuthor(
  authorId: number,
): Promise<Comment[]> {
  const res = await api.get<Comment[]>(`${BASE}/author/${authorId}`);
  return res.data;
}

/**
 * Get replies to a comment
 * GET /comments/replies/:parentId
 */
export async function getCommentReplies(parentId: number): Promise<Comment[]> {
  const res = await api.get<Comment[]>(`${BASE}/replies/${parentId}`);
  return res.data;
}

/**
 * Update a comment
 * PATCH /comments/:id
 */
export async function updateComment(
  id: number,
  data: UpdateCommentRequest,
): Promise<Comment> {
  const res = await api.patch<Comment>(`${BASE}/${id}`, data);
  return res.data;
}

/**
 * Upvote a comment
 * PATCH /comments/:id/upvote
 */
export async function upvoteComment(id: number): Promise<Comment> {
  const res = await api.patch<Comment>(`${BASE}/${id}/upvote`);
  return res.data;
}

/**
 * Downvote a comment
 * PATCH /comments/:id/downvote
 */
export async function downvoteComment(id: number): Promise<Comment> {
  const res = await api.patch<Comment>(`${BASE}/${id}/downvote`);
  return res.data;
}

/**
 * Delete a comment
 * DELETE /comments/:id
 */
export async function deleteComment(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}
