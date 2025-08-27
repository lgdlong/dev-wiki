import { fetcher } from "@/lib/fetcher";
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
} from "@/types/product";
import type {
  AssignCategoriesRequest,
  AssignCategoriesResponse,
  CreateProductCategoryRequest,
  ProductCategory,
} from "@/types/product-categories";
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
  creatorId: number,
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
  data: UpdateProductDTO,
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
 * Assign multiple categories to a product in one request
 * PUT /product-categories/assign-multiple
 * @param productId - The ID of the product
 * @param categoryIds - Array of category IDs to assign
 */
export async function assignCategoriesToProduct(
  productId: number,
  categoryIds: number[],
): Promise<AssignCategoriesResponse> {
  const requestData: AssignCategoriesRequest = { productId, categoryIds };

  return fetcher<AssignCategoriesResponse>(
    "/product-categories/assign-multiple",
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    },
  );
}

/**
 * Link a single product to a category (legacy - use assignCategoriesToProduct instead)
 * POST /product-categories/link
 * @param productId - The ID of the product
 * @param categoryId - Single category ID to link
 */
export async function linkProductCategory(
  productId: number,
  categoryId: number,
): Promise<void> {
  const requestData: CreateProductCategoryRequest = { productId, categoryId };

  return fetcher<void>("/product-categories/link", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(requestData),
  });
}

/**
 * Get categories assigned to a product
 * GET /product-categories/product/:productId/categories
 * @param productId - The ID of the product
 */
export async function getProductCategories(
  productId: number,
): Promise<ProductCategory[]> {
  return fetcher<ProductCategory[]>(
    `/product-categories/product/${productId}/categories`,
    {
      method: "GET",
    },
  );
}
