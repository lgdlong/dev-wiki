// apps/web/src/types/vote.ts

import type { EntityType } from "./comment";

// Vote type enum (matches VoteType in api_go)
export type VoteType = "up" | "down";

// Response DTO (matches VoteResponseDTO in api_go)
export interface Vote {
  id: number;
  userId: number;
  entityId: number;
  entityType: EntityType;
  voteType: VoteType;
}

// Request DTO for creating a vote (matches CreateVoteDTO in api_go)
export interface CreateVoteRequest {
  userId: number;
  entityId: number;
  entityType: EntityType;
  voteType: VoteType;
}

// Request DTO for updating a vote (matches UpdateVoteDTO in api_go)
export interface UpdateVoteRequest {
  userId?: number;
  entityId?: number;
  entityType?: EntityType;
  voteType?: VoteType;
}

// Vote counts response
export interface VoteCounts {
  upvotes: number;
  downvotes: number;
  total: number;
}
