import { api } from "@/lib/api";
import { Category, CategoryCreate, CategoryUpdate } from "@/types/category";
import { getAccessToken, getAuthHeaders } from "@/utils/auth";

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>("/categories");
  return res.data;
}

// Get category by ID
export async function getCategoryById(id: number): Promise<Category> {
  const res = await api.get<Category>(`/categories/${id}`);
  return res.data;
}

// Get category by name
export async function getCategoryByName(name: string): Promise<Category> {
  const res = await api.get<Category>(`/categories/name/${name}`);
  return res.data;
}

// Create new category
export async function createCategory(
  categoryData: CategoryCreate,
): Promise<Category> {
  const res = await api.post<Category>("/categories", categoryData);
  return res.data;
}

// Update category
export async function updateCategory(
  id: number,
  categoryData: CategoryUpdate,
): Promise<Category> {
  const res = await api.patch<Category>(`/categories/${id}`, categoryData);
  return res.data;
}

// Delete category
export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}
