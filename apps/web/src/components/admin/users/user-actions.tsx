"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserLite = {
  id: number;
  name: string;
  role: "User" | "Mod" | "Admin";
  status?: "Active" | "Suspended" | "Disabled";
};

type Props = {
  user: UserLite;
  // optional callbacks for parent
  onRoleChange?: (role: UserLite["role"]) => void;
  onSoftDelete?: () => void;
  onHardDelete?: () => void;
};

export default function UserActions({ user, onRoleChange, onSoftDelete, onHardDelete }: Props) {
  const [role, setRole] = useState<UserLite["role"]>(user.role);

  const handleUpdateRole = (next: UserLite["role"]) => {
    setRole(next);
    // TODO: API promote/demote
    console.log("[ACTIONS] change role:", user.id, next);
    onRoleChange?.(next);
  };

  const doSoftDelete = async () => {
    // TODO: API mark as deleted / banned flag
    console.log("[ACTIONS] soft delete:", user.id);
    onSoftDelete?.();
  };

  const doHardDelete = async () => {
    // TODO: API permanent delete
    console.log("[ACTIONS] hard delete:", user.id);
    onHardDelete?.();
  };

  return (
    <div className="mt-4 grid max-w-3xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Vai trò & Quyền</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <Label>Vai trò hiện tại</Label>
            <div className="text-sm text-muted-foreground">
              Chọn vai trò để promote/demote người dùng
            </div>
          </div>
          <Select value={role} onValueChange={(v) => handleUpdateRole(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Mod">Mod</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-red-200/60">
        <CardHeader>
          <CardTitle className="text-red-600">Hành động nguy hiểm</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Bạn có thể **đánh dấu xoá** (soft delete) hoặc **xóa vĩnh viễn** (hard delete).
          </div>

          <div className="flex gap-2">
            {/* Soft delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Đánh dấu xoá</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đánh dấu xoá?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Người dùng sẽ bị ẩn/ban nhưng dữ liệu còn có thể khôi phục.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={doSoftDelete}>Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Hard delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Xóa vĩnh viễn</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-600">
                    Bạn chắc chắn muốn xóa vĩnh viễn?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động không thể hoàn tác. Tất cả dữ liệu liên quan có thể bị mất.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={doHardDelete}>
                    Xóa vĩnh viễn
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
