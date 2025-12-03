// apps/web/src/types/tag.ts

// Response DTO (matches TagResponseDTO in api_go)
export interface Tag {
  id: number;
  name: string;
  description?: string;
}

// Request DTO for creating a tag (matches CreateTagDTO in api_go)
export interface CreateTagRequest {
  name: string;
  description?: string;
}

// Request DTO for updating a tag (matches UpdateTagDTO in api_go)
export interface UpdateTagRequest {
  name?: string;
  description?: string;
}

// Search params (matches TagSearchParams in api_go)
export interface TagSearchParams {
  q: string;
  limit?: number;
  cursor?: string;
  minChars?: number;
}

// Search result DTO (matches TagSearchResultDTO in api_go)
export interface TagSearchResult {
  items: Tag[];
  nextCursor: string | null;
}
