// types/product.ts
// Derived from Product entity. Keep API-facing types minimal and stable.
// Note: `creator` is a relation (not a DB column). Keep it optional for responses where you join the account.

export interface AccountSummary {
  id: number;
  name?: string | null;
  email: string | null;
  avatarUrl?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  homepageUrl?: string | null;
  githubUrl?: string | null;
  pros?: string | null;
  cons?: string | null;
  createdBy: number; // FK -> accounts.id
  createdAt: string; // ISO string preferred in API payloads
  updatedAt: string; // ISO string preferred in API payloads
  // Optional relation if you join with accounts
  creator?: AccountSummary;
}

// Client → Server: create payload (server will set createdBy from auth context)
export interface CreateProductDTO {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  homepageUrl?: string | null;
  githubUrl?: string | null;
  pros?: string | null;
  cons?: string | null;
}

// Client → Server: partial update (PATCH)
export type UpdateProductDTO = Partial<CreateProductDTO>;

// Server → Client: list item shape (identical to Product here,
// but defined separately if you later want to trim fields)
export type ProductListItem = Product;

// Helper to map DB timestamps (Date) -> API (ISO string)
export function toProduct(dto: {
  id: number;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  homepageUrl?: string | null;
  githubUrl?: string | null;
  pros?: string | null;
  cons?: string | null;
  createdBy: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  creator?: AccountSummary;
}): Product {
  return {
    ...dto,
    createdAt:
      dto.createdAt instanceof Date
        ? dto.createdAt.toISOString()
        : dto.createdAt,
    updatedAt:
      dto.updatedAt instanceof Date
        ? dto.updatedAt.toISOString()
        : dto.updatedAt,
  };
}
