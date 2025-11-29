import { api } from "@/lib/api";
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
  const res = await api.post<Product>("/products", data);
  return res.data;
}

/**
 * Get all products
 * GET /products
 */
export async function getAllProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>("/products");
  return res.data;
}

/**
 * Get a product by ID
 * GET /products/:id
 */
export async function getProductById(id: number): Promise<Product> {
  const res = await api.get<Product>(`/products/${id}`);
  return res.data;
}

/**
 * Get products by creator
 * GET /products/creator/:creatorId
 */
export async function getProductsByCreator(
  creatorId: number,
): Promise<Product[]> {
  const res = await api.get<Product[]>(`/products/creator/${creatorId}`);
  return res.data;
}

/**
 * Update a product
 * PATCH /products/:id
 */
export async function updateProduct(
  id: number,
  data: UpdateProductDTO,
): Promise<Product> {
  const res = await api.patch<Product>(`/products/${id}`, data);
  return res.data;
}

/**
 * Delete a product
 * DELETE /products/:id
 */
export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
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
  const res = await api.put<AssignCategoriesResponse>(
    "/product-categories/assign-multiple",
    requestData,
  );
  return res.data;
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
  await api.post("/product-categories/link", requestData);
}

/**
 * Get categories assigned to a product
 * GET /product-categories/product/:productId/categories
 * @param productId - The ID of the product
 */
export async function getProductCategories(
  productId: number,
): Promise<ProductCategory[]> {
  const res = await api.get<ProductCategory[]>(
    `/product-categories/product/${productId}/categories`,
  );
  return res.data;
}
