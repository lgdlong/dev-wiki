// apps/web/src/types/tutorial.ts

export interface Tutorial {
<<<<<<< HEAD
    id: number;
    title: string;
    content: string;        // markdown or text
    authorId: number;       // khóa ngoại tới User
    authorName?: string;
    views: number;          // mặc định = 0
    tags?: string[];        // hoặc mảng Tag nếu backend có entity riêng
    createdAt: string;      // ISO string (yyyy-mm-ddTHH:mm:ssZ)
    updatedAt?: string;     // có thể có nếu backend trả
  }
  
  // Interface for creating a tutorial
  export interface CreateTutorialRequest {
    title: string;
    content: string;
    author_id: number;
    tags?: string[];
  }
  
  // Interface for updating a tutorial (partial Tutorial without id/createdAt)
  export interface UpdateTutorialRequest {
    title?: string;
    content?: string;
    author_id?: number;
    views?: number;
    tags?: string[];
  }
  
=======
  id: number;
  title: string;
  content: string; // markdown or text
  authorId: number; // khóa ngoại tới User
  views: number; // mặc định = 0
  tags?: string[]; // hoặc mảng Tag nếu backend có entity riêng
  createdAt: string; // ISO string (yyyy-mm-ddTHH:mm:ssZ)
  updatedAt?: string; // có thể có nếu backend trả
}

// Interface for creating a tutorial
export interface CreateTutorialRequest {
  title: string;
  content: string;
  author_id?: number; //FE ko cần truyền id đâu có thể xóa luôn nếu cần
  tags?: string[];
}

// Interface for updating a tutorial (partial Tutorial without id/createdAt)
export interface UpdateTutorialRequest {
  title?: string;
  content?: string;
  author_id?: number;
  views?: number;
  tags?: string[];
}
>>>>>>> dev
