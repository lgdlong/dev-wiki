"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
import type { Tutorial } from "@/types/tutorial";
import Link from "next/link";

// --- Helpers ---
function formatDate(input?: string | number | Date) {
  if (!input) return "—";
  const d = new Date(input);
  // hiển thị gọn: 24/08/2025, 13:45
  return d.toLocaleString(undefined, {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function makeTutorialColumns({
  onEdit,
  onRequestDelete,
  deletingIds,
}: {
  onEdit: (id: number) => void;
  onRequestDelete: (id: number) => void;
  deletingIds: Set<number>;
}): ColumnDef<Tutorial>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="max-w-[520px] truncate">
            <div className="font-medium">
            <Link 
              href={`/mod/tutorials/${t.id}/edit`} 
              className="hover:underline text-white-500"
            >
              {t.title || "(Untitled)"}
            </Link>
            </div>
            {/* subtitle: author / id */}
            <div className="text-xs text-muted-foreground">
              {t.authorName ? `by ${t.authorName}` : "Name: Unknown"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => {
        const v = row.original.views ?? 0;
        return (
          <div className="inline-flex items-center gap-1 text-sm">
            <Eye className="h-4 w-4 opacity-70" />
            <span>{v.toLocaleString()}</span>
          </div>
        );
      },
      size: 110,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt as any)}
        </span>
      ),
      size: 170,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate((row.original as any).updatedAt)}
        </span>
      ),
      size: 170,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const t = row.original;
        const id = Number(t.id);
        const isValidId = Number.isFinite(id) && Number.isInteger(id);
        const isDeleting = isValidId && deletingIds.has(id);
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Edit tutorial"
              onClick={() => {
                if (!isValidId) return;
                onEdit(id);
              }}
              disabled={isDeleting || !isValidId}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              aria-label="Delete tutorial"
              onClick={() => {
                if (!isValidId) return;
                onRequestDelete(id);
              }}
              disabled={isDeleting || !isValidId}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      },
      enableSorting: false,
      size: 110,
    },
  ];
}
