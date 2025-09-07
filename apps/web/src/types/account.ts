// apps/web/src/types/account.ts
export type AccountRole = "user" | "premium" | "mod" | "admin";
export type AccountStatus = "active" | "inactive" | "suspended" | "banned" | "deleted";

export interface Account {
  id: number;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  name: string;
  avatar_url?: string;
  createdAt: string;  
}
