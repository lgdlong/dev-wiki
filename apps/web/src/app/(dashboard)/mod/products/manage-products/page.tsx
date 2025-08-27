"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product";
import { getAllProducts, deleteProduct } from "@/utils/api/productApi";
import { Plus, RefreshCw } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

// new imports
import { DataTable } from "./_components/data-table";
import { makeProductColumns } from "./_components/columns";

export default function ManageProductPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const data = await getAllProducts();
      setProducts(data ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return products;
    const k = q.toLowerCase();
    return products.filter((p) =>
      [p.name, p.homepageUrl, p.githubUrl]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(k)),
    );
  }, [products, q]);

  async function confirmDelete() {
    if (pendingId == null) return;
    await deleteProduct(pendingId);
    setProducts((prev) => prev.filter((x) => x.id !== pendingId));
    setPendingId(null);
  }

  const columns = makeProductColumns({
    onEdit: (id) => router.push(`/mod/products/${id}/edit`),
    onRequestDelete: (id) => {
      setPendingId(id);
      setOpenDelete(true);
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Manage Products
          </h1>
          <p className="text-sm text-muted-foreground">
            View, edit and delete products (Moderator).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => load()}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Button asChild className="gap-2">
            <Link href="/mod/products/new">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-3 pt-6">
          <Input
            placeholder="Search by name, homepage or GitHub…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <div className="text-sm text-muted-foreground">
            Total <span className="font-medium">{filtered.length}</span>{" "}
            products
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
          defaultSorting={[{ id: "id", desc: false }]}
        />
      )}

      <DeleteConfirmDialog
        open={openDelete}
        onOpenChange={(v: boolean) => {
          setOpenDelete(v);
          if (!v) setPendingId(null);
        }}
        title="Delete this product?"
        description="This action cannot be undone. The product will be permanently removed."
        confirmText="Delete product"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
