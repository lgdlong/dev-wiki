"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type Props = {
  user: {
    id: number;
    status?: "Active" | "Suspended" | "Disabled";
  };
};

export default function UserSecurity({ user }: Props) {
  const [status, setStatus] = useState<"Active" | "Suspended" | "Disabled">(user.status ?? "Active");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async (v: typeof status) => {
    setStatus(v);
    // TODO: call API update status
    console.log("[SECURITY] update status:", user.id, v);
  };

  const onResetPassword = async () => {
    if (!pwd || pwd !== pwd2) return alert("Mật khẩu xác nhận không khớp");
    setLoading(true);
    try {
      // TODO: call API reset password
      console.log("[SECURITY] reset password:", user.id, pwd);
      alert("Đã đặt lại mật khẩu!");
      setPwd("");
      setPwd2("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 grid gap-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Quản lý trạng thái hoạt động của người dùng
          </p>
          <Select value={status} onValueChange={(v) => handleChangeStatus(v as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Hoạt động</SelectItem>
              <SelectItem value="Suspended">Tạm khóa</SelectItem>
              <SelectItem value="Disabled">Vô hiệu</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Đặt lại mật khẩu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Mật khẩu mới</Label>
            <Input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Xác nhận mật khẩu</Label>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
            />
          </div>

          {/* thanh “độ mạnh” đơn giản */}
          <div className="space-y-1">
            <div className="h-1 w-full rounded bg-muted">
              <div
                className="h-1 rounded bg-primary transition-all"
                style={{ width: `${Math.min(pwd.length * 8, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Gợi ý: &ge; 8 ký tự, có chữ hoa, số và ký tự đặc biệt.
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={onResetPassword} disabled={loading}>
              {loading ? "Đang đặt lại…" : "Đặt lại mật khẩu"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử đăng nhập</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Mock 3 dòng giống ảnh chụp */}
          {[
            { ua: "Chrome on Windows", ip: "192.168.1.100", time: "2024-12-15 14:30" },
            { ua: "Safari on iPhone", ip: "10.0.1.45", time: "2024-12-14 09:15" },
            { ua: "Firefox on MacOS", ip: "172.16.0.23", time: "2024-12-13 16:20" },
          ].map((r, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-4">
              <div className="font-medium">{r.ua}</div>
              <div className="text-sm text-muted-foreground">
                {r.ip} • {r.time}
              </div>
            </div>
          ))}
          <Separator />
          <div className="text-right">
            <Button variant="outline" size="sm" onClick={() => console.log("[SECURITY] view all sessions")}>
              Xem tất cả phiên
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
