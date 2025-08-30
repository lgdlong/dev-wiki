// apps/web/src/types/tutorial.ts

export interface Tutorial {
  id: number;
  title: string;
  content: string; // markdown or text
  authorId: number; // khóa ngoại tới User
  authorName?: string;
  views: number; // mặc định = 0
  createdAt: string; // ISO string (yyyy-mm-ddTHH:mm:ssZ)
  updatedAt?: string; // có thể có nếu backend trả
}

// Interface for creating a tutorial
export interface CreateTutorialRequest {
  title: string;
  content: string;
}

// Interface for updating a tutorial (partial Tutorial without id/createdAt)
export interface UpdateTutorialRequest {
  title?: string;
  content?: string;
  author_id?: number;
  views?: number;
}
