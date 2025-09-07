"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Loader2 } from "lucide-react";
import type { Account } from "@/types/account";

function fmtDate(v?: string | number | Date | null) {
  if (!v) return "—";
  const d = new Date(v);
  return d.toLocaleString(undefined, {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function RoleBadge({ role }: { role: Account["role"] }) {
  const map: Record<Account["role"], string> = {
    user: "User",
    premium: "Premium",
    mod: "Moderator",
    admin: "Admin",
  };
  const classMap: Record<Account["role"], string> = {
    user: "bg-muted text-foreground",
    premium: "bg-blue-100/20 text-blue-300",
    mod: "bg-amber-100/20 text-amber-300",
    admin: "bg-purple-100/20 text-purple-300",
  };
  return <Badge className={classMap[role]}>{map[role]}</Badge>;
}

function StatusBadge({ status }: { status: Account["status"] }) {
  const map: Record<Account["status"], string> = {
    active: "Active",
    inactive: "Inactive",
    suspended: "Suspended",
    banned: "Banned",
    deleted: "Deleted",
  };
  const classMap: Record<Account["status"], string> = {
    active: "bg-emerald-100/20 text-emerald-300",
    inactive: "bg-muted text-foreground",
    suspended: "bg-red-100/20 text-red-300",
    banned: "bg-red-100/20 text-red-300",
    deleted: "bg-red-100/20 text-red-300"
  };
  return <Badge className={classMap[status]}>{map[status]}</Badge>;
}

export function makeAccountColumns({
  onEdit,
  onView,
  onRequestDelete,
  deletingIds,
}: {
  onEdit: (id: number) => void;
  onView: (id: number) => void;
  onRequestDelete: (id: number) => void;
  deletingIds: Set<number>;
}): ColumnDef<Account>[] {
  return [
    {
      accessorKey: "user",
      header: "User", 
      cell: ({ row }) => {
        const a = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-muted">
              {a.avatar_url ? (
                <Image
                  src={a.avatar_url}
                  alt={a.name ?? a.email}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-muted-foreground">
                  <span className="text-lg">👤</span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate font-medium">
                <Link
                  href={`/mod/accounts/${a.id}`}
                  className="hover:underline"
                >
                  {a.name || "(No name)"}
                </Link>
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {a.email}
              </div>
            </div>
          </div>
        );
      },
      size: 340,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      size: 140,
    },
    {
      accessorKey: "createdAt",
      header: "Join Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {fmtDate(row.original.createdAt)}
        </span>
      ),
      size: 170,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const a = row.original;
        const id = Number(row.original.id);
        const isDeleting = Number.isFinite(id) && deletingIds.has(id);
        return (
          <div className="flex justify-start gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Edit user"
              onClick={() => onEdit(id)}
              disabled={isDeleting}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="View user"
              onClick={() => onView(id)}
              disabled={isDeleting}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* Delete chỉ hiển thị nếu status !== "deleted" */}
            {a.status !== "deleted" && (
              <Button
                size="icon"
                variant="destructive"
                aria-label="Delete user"
                onClick={() => onRequestDelete(id)}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 130,
    },
  ];
}
