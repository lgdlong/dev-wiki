// apps/web/src/types/tutorial.ts
export interface Tutorial {
  id: number;
  title: string;
  content: string; // markdown or text
  authorId: number; // khóa ngoại tới User
  authorName?: string;
  views: number; // mặc định = 0
  tags?: string[]; // hoặc mảng Tag nếu backend có entity riêng
  slug?: string; // SEO-friendly URL segment
  isPublished: boolean; // mặc định = true
  createdAt: string; // ISO string (yyyy-mm-ddTHH:mm:ssZ)
  updatedAt: string; // ISO string (yyyy-mm-ddTHH:mm:ssZ)
}

// Interface for creating a tutorial
export interface CreateTutorialRequest {
  title: string;
  content: string;
  author_id?: number;
  tags?: string[];
  slug?: string;
}

// Interface for updating a tutorial (partial Tutorial without id/createdAt)
export interface UpdateTutorialRequest {
  title?: string;
  content?: string;
  author_id?: number;
  views?: number;
  tags?: string[];
  slug?: string;
}
