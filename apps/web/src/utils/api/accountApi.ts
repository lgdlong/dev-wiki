// apps/web/src/api/accountApi.ts
import type { Account } from "@/types/account";
import { fetcher } from "@/lib/fetcher";
import { getAuthHeaders } from "../auth";

// ===== Types cho payloads =====
export type UpdateAccountPayload = Partial<Pick<
  Account,
  "name" | "email" | "avatar_url" | "role" | "status"
>>;

export interface SetStatusPayload {
  status: string;            // "active" | "deleted" | "banned" | "inactive" | ...
  reason?: string;           // optional: vì sao đổi status
  expiresAt?: string | null; // optional: nếu là ban tạm thời -> ISO timestamp
}

// ===== CRUD cơ bản =====
export async function getAllAccounts(): Promise<Account[]> {
  return fetcher<Account[]>("/accounts", {
    headers: getAuthHeaders(),
  });
}

export async function getAccountById(id: number): Promise<Account> {
  return fetcher<Account>(`/accounts/${id}`, {
    headers: getAuthHeaders(),
  });
}

export async function updateAccount(
  id: number,
  payload: UpdateAccountPayload,
): Promise<Account> {
  return fetcher<Account>(`/accounts/${id}`, {
    method: "PATCH", // hoặc "PUT" nếu BE bạn dùng PUT
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteAccount(
  id: number,
): Promise<{ success: boolean }> {
  return fetcher<{ success: boolean }>(`/accounts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

// ===== Hành động moderation / status ===== (build sẵn để mốt sửa DB luôn đó là cái field reason)

// Đổi status nói chung (active -> deleted / banned / inactive ...)
export async function setAccountStatus(
  id: number,
  payload: SetStatusPayload,
): Promise<Account> {
  // Backend gợi ý: PATCH /accounts/:id/status  { status, reason?, expiresAt? }
  return fetcher<Account>(`/accounts/${id}/status`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// Mark "deleted" (soft) — chỉ là wrapper cho setAccountStatus
export async function markAccountDeleted(
  id: number,
  reason = "manual-delete",
): Promise<Account> {
  return setAccountStatus(id, { status: "deleted", reason });
}

// Ban: vĩnh viễn hoặc tạm thời (expiresAt)
export async function banAccount(
  id: number,
  opts: { reason?: string; expiresAt?: string | null } = {},
): Promise<Account> {
  const { reason = "violation", expiresAt = null } = opts;
  return setAccountStatus(id, { status: "banned", reason, expiresAt });
}

// Bỏ ban / kích hoạt lại
export async function activateAccount(
  id: number,
  reason = "manual-activate",
): Promise<Account> {
  return setAccountStatus(id, { status: "active", reason });
}
