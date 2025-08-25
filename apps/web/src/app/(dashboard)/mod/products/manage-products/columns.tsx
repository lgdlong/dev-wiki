// app/(dashboard)/mod/products/manage-products/columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";

export function makeProductColumns({
  onEdit,
  onRequestDelete,
}: {
  onEdit: (id: number) => void;
  onRequestDelete: (id: number) => void;
}): ColumnDef<Product>[] {
  return [
    {
      id: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const p = row.original;
        return p.logoUrl ? (
          <div className="h-8 w-8 overflow-hidden rounded border">
            <Image
              src={p.logoUrl}
              alt={p.name}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="h-8 w-8 rounded bg-muted" />
        );
      },
      size: 60,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "homepageUrl",
      header: "Homepage",
      cell: ({ row }) => {
        const url = row.original.homepageUrl;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {url}
          </a>
        ) : (
          "—"
        );
      },
    },
    {
      accessorKey: "githubUrl",
      header: "GitHub",
      cell: ({ row }) => {
        const url = row.original.githubUrl;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {url}
          </a>
        ) : (
          "—"
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const d = row.original.createdAt
          ? new Date(row.original.createdAt)
          : null;
        return (
          <span className="text-sm text-muted-foreground">
            {d ? d.toLocaleString() : "—"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              aria-label="Edit product"
              onClick={() => onEdit(p.id as number)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              aria-label="Delete product"
              onClick={() => onRequestDelete(p.id as number)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      size: 180,
      enableSorting: false,
    },
  ];
}
