// apps/web/src/utils/api/voteApi.ts
import { api } from "@/lib/api";
import {
  Vote,
  VoteCounts,
  CreateVoteRequest,
  UpdateVoteRequest,
  VoteType,
} from "@/types/vote";
import { EntityType } from "@/types/comment";

const BASE = "/votes";

/**
 * Create a new vote
 * POST /votes
 */
export async function createVote(data: CreateVoteRequest): Promise<Vote> {
  const res = await api.post<Vote>(BASE, data);
  return res.data;
}

/**
 * Change or toggle vote (create, update, or remove)
 * POST /votes/change
 * Returns null if vote was removed
 */
export async function changeVote(
  data: CreateVoteRequest,
): Promise<Vote | { removed: boolean }> {
  const res = await api.post<Vote | { removed: boolean }>(
    `${BASE}/change`,
    data,
  );
  return res.data;
}

/**
 * Get all votes
 * GET /votes
 */
export async function getAllVotes(): Promise<Vote[]> {
  const res = await api.get<Vote[]>(BASE);
  return res.data;
}

/**
 * Get a vote by ID
 * GET /votes/:id
 */
export async function getVoteById(id: number): Promise<Vote> {
  const res = await api.get<Vote>(`${BASE}/${id}`);
  return res.data;
}

/**
 * Get votes by entity
 * GET /votes/entity/:entityType/:entityId
 */
export async function getVotesByEntity(
  entityType: EntityType,
  entityId: number,
): Promise<Vote[]> {
  const res = await api.get<Vote[]>(`${BASE}/entity/${entityType}/${entityId}`);
  return res.data;
}

/**
 * Get vote counts for an entity
 * GET /votes/entity/:entityType/:entityId/count
 */
export async function getVoteCounts(
  entityType: EntityType,
  entityId: number,
): Promise<VoteCounts> {
  const res = await api.get<VoteCounts>(
    `${BASE}/entity/${entityType}/${entityId}/count`,
  );
  return res.data;
}

/**
 * Get votes by user
 * GET /votes/user/:userId
 */
export async function getVotesByUser(userId: number): Promise<Vote[]> {
  const res = await api.get<Vote[]>(`${BASE}/user/${userId}`);
  return res.data;
}

/**
 * Get user's vote on a specific entity
 * GET /votes/user/:userId/entity/:entityType/:entityId
 */
export async function getUserVoteOnEntity(
  userId: number,
  entityType: EntityType,
  entityId: number,
): Promise<Vote | null> {
  try {
    const res = await api.get<Vote>(
      `${BASE}/user/${userId}/entity/${entityType}/${entityId}`,
    );
    return res.data;
  } catch {
    // 404 means no vote exists
    return null;
  }
}

/**
 * Update a vote
 * PATCH /votes/:id
 */
export async function updateVote(
  id: number,
  data: UpdateVoteRequest,
): Promise<Vote> {
  const res = await api.patch<Vote>(`${BASE}/${id}`, data);
  return res.data;
}

/**
 * Delete a vote
 * DELETE /votes/:id
 */
export async function deleteVote(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}

/**
 * Remove user's vote on a specific entity
 * DELETE /votes/user/:userId/entity/:entityType/:entityId
 */
export async function removeUserVote(
  userId: number,
  entityType: EntityType,
  entityId: number,
): Promise<void> {
  await api.delete(`${BASE}/user/${userId}/entity/${entityType}/${entityId}`);
}

// ==================== Convenience Functions ====================

/**
 * Toggle upvote for an entity
 */
export async function toggleUpvote(
  userId: number,
  entityType: EntityType,
  entityId: number,
): Promise<Vote | { removed: boolean }> {
  return changeVote({ userId, entityType, entityId, voteType: "up" });
}

/**
 * Toggle downvote for an entity
 */
export async function toggleDownvote(
  userId: number,
  entityType: EntityType,
  entityId: number,
): Promise<Vote | { removed: boolean }> {
  return changeVote({ userId, entityType, entityId, voteType: "down" });
}
