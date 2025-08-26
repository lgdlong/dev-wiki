import { fetcher } from "@/lib/fetcher";
import { Category, CategoryCreate, CategoryUpdate } from "@/types/category";
import { getAccessToken, getAuthHeaders } from "@/utils/auth";

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  return fetcher("/categories", {
    method: "GET",
  });
}

// Get category by ID
export async function getCategoryById(id: number): Promise<Category> {
  return fetcher(`/categories/${id}`, {
    method: "GET",
  });
}

// Get category by name
export async function getCategoryByName(name: string): Promise<Category> {
  return fetcher(`/categories/name/${name}`, {
    method: "GET",
  });
}

// Create new category
export async function createCategory(
  categoryData: CategoryCreate,
): Promise<Category> {
  const token = getAccessToken();
  if (!token) throw new Error("Authentication required to create category!");

  return fetcher("/categories", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
}

// Update category
export async function updateCategory(
  id: number,
  categoryData: CategoryUpdate,
): Promise<Category> {
  const token = getAccessToken();
  if (!token) throw new Error("Authentication required to update category!");

  return fetcher(`/categories/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
}

// Delete category
export async function deleteCategory(id: number): Promise<void> {
  const token = getAccessToken();
  if (!token) throw new Error("Authentication required to delete category!");

  return fetcher(`/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
