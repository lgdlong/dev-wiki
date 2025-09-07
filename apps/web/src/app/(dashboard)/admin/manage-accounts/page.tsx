"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/app/(dashboard)/admin/manage-accounts/data-table";
import { makeAccountColumns } from "./columns";
import type { Account, AccountStatus } from "@/types/account";
import { getAllAccounts, deleteAccount } from "@/utils/api/accountApi";
import { Plus, RefreshCw, ChevronDown } from "lucide-react";
import type { SortingState, ColumnDef } from "@tanstack/react-table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Toast, type ToastKind } from "@/components/ui/announce-success-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const DEFAULT_SORT: SortingState = [{ id: "createdAt", desc: true }];

const STATUS_LABEL: Record<AccountStatus | "all", string> = {
  all: "All Status",
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
  banned: "Banned",
};

export default function ManageAccountsPage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<AccountStatus | "all">("all");

  const [openDelete, setOpenDelete] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  const [toast, setToast] = useState<{ open: boolean; kind: ToastKind; message: string }>({
    open: false,
    kind: "success",
    message: "",
  });

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const data = await getAllAccounts();
      setAccounts(data ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    return accounts.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (!key) return true;
      const hay = [a.name, a.email, String(a.id)].filter(Boolean).map((x) => String(x).toLowerCase());
      return hay.some((s) => s.includes(key));
    });
  }, [accounts, q, status]);

  const columns: ColumnDef<Account>[] = useMemo(
    () =>
      makeAccountColumns({
        onEdit: (id) => router.push(`/mod/accounts/${id}/edit`),
        onView: (id) => router.push(`/mod/accounts/${id}`),
        onRequestDelete: (id) => {
          setPendingId(id);
          setOpenDelete(true);
        },
        deletingIds,
      }),
    [router, deletingIds]
  );

  async function confirmDelete() {
    if (pendingId == null) return;
    setDeletingIds((prev) => new Set(prev).add(pendingId));
    setOpenDelete(false);
    try {
      await deleteAccount(pendingId);
      setAccounts((prev) => prev.filter((x) => x.id !== pendingId));
      setToast({ open: true, kind: "success", message: `Deleted account #${pendingId}` });
    } catch (e: any) {
      setToast({ open: true, kind: "error", message: e?.message ?? "Delete failed. Please try again." });
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(pendingId!);
        return next;
      });
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Toast open={toast.open} kind={toast.kind} message={toast.message} onClose={() => setToast((t) => ({ ...t, open: false }))} duration={2500} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor all user accounts in your system.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => load()}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button asChild className="gap-2">
            <Link href="/mod/accounts/new">
              <Plus className="h-4 w-4" /> Add User
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-3 pt-6">
          <Input
            placeholder="Search users by name or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {STATUS_LABEL[status]} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {(["all", "active", "inactive", "suspended", "banned"] as const).map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setStatus(s as any)}>
                    {STATUS_LABEL[s]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filtered.length}</span> users
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-24 animate-pulse rounded-md border bg-muted" />
      ) : err ? (
        <div className="rounded-md border p-3 text-red-600">{err}</div>
      ) : (
        <DataTable columns={columns} data={filtered} defaultSorting={DEFAULT_SORT} />
      )}

      <DeleteConfirmDialog
        open={openDelete}
        onOpenChange={(v: boolean) => {
          setOpenDelete(v);
          if (!v) setPendingId(null);
        }}
        title="Delete this user?"
        description="This action cannot be undone. The account will be permanently removed."
        confirmText="Delete user"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
