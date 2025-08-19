export interface Tag {
  id: number;
  name: string;
  description?: string | null;
}

export interface CreateTagRequest {
  name: string;
  description?: string | null;
}
