// app/mod/tutorials/manage-tutorials/columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import type { Tutorial } from "@/types/tutorial"; // <- nếu chưa có type, xem note bên dưới

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

function renderTags(tags?: string[]) {
  if (!tags || tags.length === 0) return <span className="text-sm text-muted-foreground">—</span>;
  const shown = tags.slice(0, 3);
  const rest = tags.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1 max-w-[280px]">
      {shown.map((t) => (
        <Badge key={t} variant="secondary" className="px-2 py-0.5">
          {t}
        </Badge>
      ))}
      {rest > 0 && (
        <Badge variant="outline" className="px-2 py-0.5">+{rest}</Badge>
      )}
    </div>
  );
}

export function makeTutorialColumns({
  onEdit,
  onRequestDelete,
}: {
  onEdit: (id: number) => void;
  onRequestDelete: (id: number) => void;
}): ColumnDef<Tutorial>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const t = row.original;
        return (
          <div className="max-w-[520px] truncate">
            <div className="font-medium">{t.title || "(Untitled)"}</div>
            {/* subtitle: author / id */}
            <div className="text-xs text-muted-foreground">
              {t.authorName ? `by ${t.authorName}` : t.authorId ? `author #${t.authorId}` : "—"}
              {typeof t.id !== "undefined" ? ` • ID: ${t.id}` : ""}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => renderTags((row.original as any).tags),
      size: 220,
      enableSorting: false,
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
        return (
          <div className="flex justify-end gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Edit tutorial"
              onClick={() => onEdit(t.id as unknown as number)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              aria-label="Delete tutorial"
              onClick={() => onRequestDelete(t.id as unknown as number)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
      size: 110,
    },
  ];
}

/**
 * NOTE:
 * Nếu bạn CHƯA có type Tutorial trong "@/types/tutorial", có thể dùng tối thiểu như sau:
 * 
 * export type Tutorial = {
 *   id: number;
 *   title: string;
 *   content?: string;
 *   authorId?: number;
 *   authorName?: string;
 *   tags?: string[];
 *   views?: number;
 *   createdAt?: string | Date;
 *   updatedAt?: string | Date;
 * };
 * 
 * Hoặc mở rộng theo schema BE của bạn.
 */
