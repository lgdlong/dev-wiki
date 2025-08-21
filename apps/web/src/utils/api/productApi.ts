import { fetcher } from "@/lib/fetcher";
import type { Product, CreateProductDTO, UpdateProductDTO } from "@/types/product";
import { getAccessToken } from "@/utils/auth";

/**
 * Create a new product
 * POST /products
 */
export async function createProduct(data: CreateProductDTO): Promise<Product> {
  const token = getAccessToken();
  return fetcher<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
export async function getProductsByCreator(creatorId: number): Promise<Product[]> {
  return fetcher<Product[]>(`/products/creator/${creatorId}`, {
    method: "GET",
  });
}

/**
 * Update a product
 * PATCH /products/:id
 */
export async function updateProduct(id: number, data: UpdateProductDTO): Promise<Product> {
  return fetcher<Product>(`/products/${id}`, {
    method: "PATCH",
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
  });
}
