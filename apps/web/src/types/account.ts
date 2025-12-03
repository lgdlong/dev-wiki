// apps/web/src/types/account.ts

// Response DTO (matches AccountResponseDTO in api_go)
export interface Account {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
}

// Request DTO for creating an account (matches CreateAccountDTO in api_go)
export interface CreateAccountRequest {
  email: string;
  name: string;
  password: string;
  role: AccountRole;
}

// Request DTO for updating an account (matches UpdateAccountDTO in api_go)
export interface UpdateAccountRequest {
  email?: string;
  name?: string;
  password?: string;
  role?: AccountRole;
  avatar_url?: string;
}

// Account role enum
export type AccountRole = "guest" | "user" | "mod" | "admin";

// Account status enum
export type AccountStatus = "active" | "inactive" | "banned";
