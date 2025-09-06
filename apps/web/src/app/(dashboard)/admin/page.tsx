"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Activity, FileText, Headphones } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Mock Data -------------------------------------------------

const metrics = [
  {
    title: "Tổng người dùng",
    value: 12847,
    change: "+15.3% so với tháng trước",
    positive: true,
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Phiên hoạt động",
    value: 3421,
    change: "+8.2% so với tháng trước",
    positive: true,
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "Tổng bài viết",
    value: 1247,
    change: "+22.1% so với tháng trước",
    positive: true,
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Yêu cầu hỗ trợ",
    value: 127,
    change: "-5.1% so với tháng trước",
    positive: false,
    icon: <Headphones className="h-5 w-5" />,
  },
];

const userGrowth = [
  { name: "T1", value: 4000 },
  { name: "T2", value: 3000 },
  { name: "T3", value: 2000 },
  { name: "T4", value: 2800 },
  { name: "T5", value: 1900 },
  { name: "T6", value: 2500 },
  { name: "T7", value: 3500 },
];

const postStats = [
  { name: "T1", value: 250 },
  { name: "T2", value: 120 },
  { name: "T3", value: 980 },
  { name: "T4", value: 400 },
  { name: "T5", value: 500 },
  { name: "T6", value: 420 },
  { name: "T7", value: 470 },
];

const activities = [
  { user: "Nguyễn Văn A", action: "Tạo tài khoản mới", time: "2 phút trước" },
  { user: "Trần Thị B", action: "Cập nhật thông tin cá nhân", time: "5 phút trước" },
  { user: "Lê Văn C", action: "Đăng bài viết mới", time: "12 phút trước" },
  { user: "Phạm Thị D", action: "Gửi yêu cầu hỗ trợ", time: "25 phút trước" },
  { user: "Hoàng Văn E", action: "Đăng nhập từ thiết bị mới", time: "1 giờ trước" },
];

// --- Page ------------------------------------------------------

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Tổng quan Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Chào mừng trở lại! Đây là những gì đang xảy ra với nền tảng của bạn hôm nay.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <Card key={i}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
              <div className="rounded-md bg-muted p-2">{m.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value.toLocaleString()}</div>
              <p
                className={`text-xs mt-1 ${
                  m.positive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {m.positive ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}{" "}
                {m.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" fill="#93c5fd" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={postStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {activities.map((a, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{a.user}</div>
                  <div className="text-sm text-muted-foreground">{a.action}</div>
                </div>
                <div className="text-xs text-muted-foreground">{a.time}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
