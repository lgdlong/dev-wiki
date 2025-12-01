// "id": 1,
// "name": "Website builders",
// "slug": "website-builders",
// "description": "The best website builders.",
// "createdAt": "2025-07-15T03:42:46.565Z"
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}
export interface CategoryCreate {
  name: string;
  slug: string;
  description?: string;
}
export interface CategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
}
