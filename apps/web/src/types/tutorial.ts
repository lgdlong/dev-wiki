// apps/web/src/types/tutorial.ts
import type { Tag } from "./tag";

// Response DTO for list view (matches TutorialListItemDTO in api_go)
export interface TutorialListItem {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorAvatarUrl: string;
}

// Response DTO for detail view (matches TutorialDetailDTO in api_go)
export interface TutorialDetail {
  id: number;
  title: string;
  slug: string;
  content: string;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorAvatarUrl: string;
  tags: Tag[];
}

// Legacy interface for backward compatibility
export interface Tutorial extends TutorialDetail {
  authorId?: number;
}

// Request DTO for creating a tutorial (matches CreateTutorialDTO in api_go)
export interface CreateTutorialRequest {
  title: string;
  content: string;
}

// Request DTO for updating a tutorial (matches UpdateTutorialDTO in api_go)
export interface UpdateTutorialRequest {
  title?: string;
  content?: string;
}
