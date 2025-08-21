"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Product } from "@/types/product";
import { getAllProducts, deleteProduct } from "@/utils/api/productApi";
import { Plus, RefreshCw } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Products</h1>
          <p className="text-sm text-muted-foreground">View, edit and delete products (Moderator).</p>
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
            Total <span className="font-medium">{filtered.length}</span> products
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-24 animate-pulse rounded-md border bg-muted" />
      ) : err ? (
        <div className="rounded-md border p-3 text-red-600">{err}</div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70px]">ID</TableHead>
                <TableHead className="w-[60px]">Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Homepage</TableHead>
                <TableHead>GitHub</TableHead>
                <TableHead className="w-[180px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>
                    {p.logoUrl ? (
                      <img
                        src={p.logoUrl}
                        alt={p.name}
                        className="h-8 w-8 rounded object-contain border"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    {p.homepageUrl ? (
                      <a
                        href={p.homepageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {p.homepageUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {p.githubUrl}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/mod/products/${p.id}/edit`)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setPendingId(p.id);
                        setOpenDelete(true);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog xác nhận xoá */}
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
