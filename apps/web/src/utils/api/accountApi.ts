// apps/web/src/api/accountApi.ts
import { Account } from "@/types/account";
import { fetcher } from "@/lib/fetcher";
import { getAuthHeaders } from "../auth";

export async function getAllAccounts(): Promise<Account[]> {
  return fetcher<Account[]>("/accounts", {
    headers: getAuthHeaders(),
  });
}

export async function deleteAccount(id: number): Promise<{ success: boolean }> {
  return fetcher<{ success: boolean }>(`/accounts/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
