/**
 * Product Categories API Types
 * These types match the backend DTOs for product-category operations
 */

/**
 * Request DTO for assigning multiple categories to a product
 */
export interface AssignCategoriesRequest {
  productId: number;
  categoryIds: number[];
}

/**
 * Response DTO for category assignment operations
 * Provides detailed feedback about the assignment results
 */
export interface AssignCategoriesResponse {
  /** Number of categories newly assigned in this operation */
  assigned: number;
  /** Number of categories that were already assigned (skipped) */
  skipped: number;
  /** Total number of categories now assigned to the product */
  total: number;
  /** Array of category IDs that were newly assigned */
  newlyAssigned: number[];
  /** Array of category IDs that were already assigned */
  alreadyAssigned: number[];
}

/**
 * Request DTO for linking a single product to a category
 */
export interface CreateProductCategoryRequest {
  productId: number;
  categoryId: number;
}

/**
 * Product-Category relationship entity
 */
export interface ProductCategory {
  id: number;
  productId: number;
  categoryId: number;
  createdAt: string;

  // Optional populated relations
  product?: {
    id: number;
    name: string;
    description?: string;
    homepageUrl?: string;
    githubUrl?: string;
  };

  category?: {
    id: number;
    name: string;
    description?: string;
    slug: string;
  };
}

/**
 * API response for getting product categories
 */
export interface ProductCategoriesResponse {
  data: ProductCategory[];
  total: number;
}
