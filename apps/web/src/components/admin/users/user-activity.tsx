"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Activity = {
  id: string;
  action: string;
  at: string; // ISO
  ip?: string;
  meta?: string;
};

type Props = {
  userId: number;
};

export default function UserActivity({ userId }: Props) {
  // mock logs
  const [q, setQ] = useState("");
  const data = useMemo<Activity[]>(
    () => [
      { id: "1", action: "Cập nhật hồ sơ", at: "2024-12-15T15:10:00Z", ip: "192.168.1.100" },
      { id: "2", action: "Đổi mật khẩu", at: "2024-12-10T09:45:00Z" },
      { id: "3", action: "Đăng nhập", at: "2024-12-10T09:40:00Z", ip: "10.0.1.45", meta: "iPhone" },
      { id: "4", action: "Upload avatar", at: "2024-12-01T12:00:00Z" },
    ],
    []
  );

  const filtered = data.filter(
    (x) =>
      !q ||
      x.action.toLowerCase().includes(q.toLowerCase()) ||
      x.ip?.includes(q) ||
      x.meta?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="mt-4 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hoạt động gần đây</CardTitle>
          <div className="flex gap-2">
            <Input
              className="w-[240px]"
              placeholder="Tìm theo hành động, IP…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button variant="outline" onClick={() => console.log("[ACTIVITY] export", userId)}>
              Xuất CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filtered.map((log, i) => (
            <div key={log.id} className="relative">
              <div className="flex items-start gap-3">
                {/* dot */}
                <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary" />
                <div>
                  <div className="font-medium">{log.action}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(log.at).toLocaleString()} {log.ip ? `• ${log.ip}` : ""}{" "}
                    {log.meta ? `• ${log.meta}` : ""}
                  </div>
                </div>
              </div>
              {i < filtered.length - 1 && <Separator className="ml-5 my-4" />}
            </div>
          ))}

          {!filtered.length && (
            <div className="text-center text-sm text-muted-foreground">Không có hoạt động.</div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => console.log("[ACTIVITY] load more")}>
              Tải thêm
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
