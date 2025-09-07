export interface Tag {
  id: number;
  name: string;
  description?: string;
}

export interface CreateTagRequest {
  name: string;
  description?: string;
}

