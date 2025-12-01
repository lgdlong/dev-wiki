// 1) IMPORTS
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { makeTutorialColumns } from "./columns";
import type { Tutorial } from "@/types/tutorial";
import { getAllTutorials, deleteTutorial } from "@/utils/api/tutorialApi";
import { Plus, RefreshCw } from "lucide-react";
import type { SortingState, ColumnDef } from "@tanstack/react-table";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { Toast, type ToastKind } from "@/components/ui/announce-success-toast";

const DEFAULT_SORT: SortingState = [{ id: "createdAt", desc: true }];

export default function ManageTutorialPage() {
  const router = useRouter();

  // 2) STATE
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // ⬇️ NEW: state cho Toast tự viết
  const [toast, setToast] = useState<{
    open: boolean;
    kind: ToastKind;
    message: string;
  }>({
    open: false,
    kind: "success",
    message: "",
  });

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const data = await getAllTutorials();
      setTutorials(data ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load tutorials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // search…
  const filtered = useMemo(() => {
    if (!q) return tutorials;
    const k = q.toLowerCase();
    return tutorials.filter((t) => {
      const haystack = [t.title, t.content, String(t.authorId)]
        .filter(Boolean)
        .map((x) => String(x).toLowerCase());
      return haystack.some((s) => s.includes(k));
    });
  }, [tutorials, q]);

  const columns: ColumnDef<Tutorial>[] = useMemo(
    () =>
      makeTutorialColumns({
        onEdit: (id: number) => router.push(`/mod/tutorials/${id}/edit`),
        onRequestDelete: (id: number) => {
          setPendingId(id);
          setOpenDelete(true);
        },
        deletingIds, // để columns hiển thị skeleton + spinner ở dòng đang xoá
      }),
    [router, deletingIds],
  );

  // 3) CONFIRM DELETE → skeleton + toast
  async function confirmDelete() {
    if (pendingId == null) return;
    setDeletingIds((prev) => new Set(prev).add(pendingId));
    setOpenDelete(false);

    try {
      await deleteTutorial(pendingId);
      setTutorials((prev) => prev.filter((x) => x.id !== pendingId));
      // ✅ success toast
      setToast({
        open: true,
        kind: "success",
        message: `Deleted tutorial #${pendingId}`,
      });
    } catch (e: any) {
      console.error("Delete failed", e);
      // ❌ error toast
      setToast({
        open: true,
        kind: "error",
        message: e?.message ?? "Delete failed. Please try again.",
      });
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
      {/* ⬇️ Render Toast của bạn (fixed top-right) */}
      <Toast
        open={toast.open}
        kind={toast.kind}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        duration={2500}
      />

      {/* header + search giữ nguyên */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Manage Tutorials
          </h1>
          <p className="text-sm text-muted-foreground">
            View, search, edit and delete tutorials (Moderator).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => load()}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button asChild className="gap-2">
            <Link href="/mod/tutorials/new">
              <Plus className="h-4 w-4" /> New Tutorial
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-3 pt-6">
          <Input
            placeholder="Search by title, content, tags or author ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <div className="text-sm text-muted-foreground">
            Total <span className="font-medium">{filtered.length}</span>{" "}
            tutorials
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-24 animate-pulse rounded-md border bg-muted" />
      ) : err ? (
        <div className="rounded-md border p-3 text-red-600">{err}</div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          defaultSorting={DEFAULT_SORT}
        />
      )}

      {/* Confirm dialog giữ nguyên */}
      <DeleteConfirmDialog
        open={openDelete}
        onOpenChange={(v: boolean) => {
          setOpenDelete(v);
          if (!v) setPendingId(null);
        }}
        title="Delete this tutorial?"
        description="This action cannot be undone. The tutorial will be permanently removed."
        confirmText="Delete tutorial"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
