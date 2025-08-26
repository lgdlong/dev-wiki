import { fetcher } from "@/lib/fetcher";
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";
import { getAccessToken, getAuthHeaders } from "@/utils/auth";

/**
 * Create a new product
 * POST /products
 */
export async function createProduct(data: CreateProductDTO): Promise<Product> {
  const token = getAccessToken();
  return fetcher<Product>("/products", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

/**
 * Get all products
 * GET /products
 */
export async function getAllProducts(): Promise<Product[]> {
  return fetcher<Product[]>("/products", {
    method: "GET",
  });
}

/**
 * Get a product by ID
 * GET /products/:id
 */
export async function getProductById(id: number): Promise<Product> {
  return fetcher<Product>(`/products/${id}`, {
    method: "GET",
  });
}

/**
 * Get products by creator
 * GET /products/creator/:creatorId
 */
export async function getProductsByCreator(
  creatorId: number
): Promise<Product[]> {
  return fetcher<Product[]>(`/products/creator/${creatorId}`, {
    method: "GET",
  });
}

/**
 * Update a product
 * PATCH /products/:id
 */
export async function updateProduct(
  id: number,
  data: UpdateProductDTO
): Promise<Product> {
  return fetcher<Product>(`/products/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

/**
 * Delete a product
 * DELETE /products/:id
 */
export async function deleteProduct(id: number): Promise<void> {
  return fetcher<void>(`/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

/**
 * TODO: connect real API
 * Update a product's category assignment
 * @param productId - The ID of the product to update
 * @param categoryId - The ID of the category to assign (null to remove category)
 */
export async function updateProductCategory(
  productId: number,
  categoryId: number | null
): Promise<void> {
  // TODO: implement API call
  // Example implementation:
  // return fetcher<void>(`/products/${productId}/category`, {
  //   method: "PATCH",
  //   body: JSON.stringify({ categoryId }),
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${getAccessToken()}`,
  //   },
  // });

  // Placeholder for now
  console.log(`TODO: Update product ${productId} category to ${categoryId}`);
  return Promise.resolve();
}
