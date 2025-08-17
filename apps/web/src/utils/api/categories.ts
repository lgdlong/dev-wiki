import { fetcher } from "@/lib/fetcher";
import { Category, CategoryCreate, CategoryUpdate } from "@/types/category";

// Helper function to get auth headers
function getAuthHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  return fetcher("/categories", {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

// Get category by ID
export async function getCategoryById(id: number): Promise<Category> {
  return fetcher(`/categories/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

// Get category by name
export async function getCategoryByName(name: string): Promise<Category> {
  return fetcher(`/categories/name/${name}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

// Create new category
export async function createCategory(
  categoryData: CategoryCreate,
): Promise<Category> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("Authentication required to update category!");

  return fetcher(`/categories/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
}

// Delete category
export async function deleteCategory(id: number): Promise<void> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (!token) throw new Error("Authentication required to delete category!");

  return fetcher(`/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
