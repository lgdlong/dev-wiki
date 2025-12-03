// apps/web/src/utils/api/accountApi.ts
import { api } from "@/lib/api";
import {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
} from "@/types/account";

const BASE = "/accounts";

/**
 * Create a new account
 * POST /accounts
 */
export async function createAccount(
  data: CreateAccountRequest,
): Promise<Account> {
  const res = await api.post<Account>(BASE, data);
  return res.data;
}

/**
 * Get all accounts
 * GET /accounts
 */
export async function getAllAccounts(): Promise<Account[]> {
  const res = await api.get<Account[]>(BASE);
  return res.data;
}

/**
 * Get an account by ID
 * GET /accounts/:id
 */
export async function getAccountById(id: number): Promise<Account> {
  const res = await api.get<Account>(`${BASE}/${id}`);
  return res.data;
}

/**
 * Update an account
 * PATCH /accounts/:id
 */
export async function updateAccount(
  id: number,
  data: UpdateAccountRequest,
): Promise<Account> {
  const res = await api.patch<Account>(`${BASE}/${id}`, data);
  return res.data;
}

/**
 * Delete an account
 * DELETE /accounts/:id
 */
export async function deleteAccount(id: number): Promise<void> {
  await api.delete(`${BASE}/${id}`);
}
