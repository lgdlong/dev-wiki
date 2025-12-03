// apps/web/src/types/comment.ts

// Entity types (matches EntityType in api_go)
export type EntityType = "tutorial" | "video" | "product";

// Response DTO (matches CommentResponseDTO in api_go)
export interface Comment {
  id: number;
  content: string;
  authorId: number;
  authorName?: string;
  parentId?: number | null;
  entityType: EntityType;
  entityId: number;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

// Request DTO for creating a comment (matches CreateCommentDTO in api_go)
export interface CreateCommentRequest {
  content: string;
  authorId: number;
  parentId?: number;
  entityType: EntityType;
  entityId: number;
}

// Request DTO for updating a comment (matches UpdateCommentDTO in api_go)
export interface UpdateCommentRequest {
  content?: string;
  upvotes?: number;
}
