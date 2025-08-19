// app/(dashboard)/mod/page.tsx  (hoặc app/mod/page.tsx nếu bạn đang ở Windows không tạo được folder có ())
// Skeleton: Moderator Dashboard (Next.js App Router + Tailwind + shadcn/ui + lucide-react)
// - Quick Actions (New Post/Link/Product/Tag/Playlist)
// - Metrics cards (Totals, Views, Comments, Votes)
// - Recent Activity list
// - Latest Content tables (Posts/Links/Products) with Edit/Hide/Delete
// - Latest Comments glance
// Lưu ý: Các URL dưới đây chỉ là placeholder; đổi theo route thật của bạn.

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, FileText, LinkIcon, Box, Tag, ListPlus, RefreshCw, Edit, EyeOff, Trash2, MessageCircle } from "lucide-react";

// ---- Types (có thể tách ra /types trong dự án thật) ------------------------

type Metrics = {
  totalPosts: number;
  totalLinks: number;
  totalProducts: number;
  totalViews: number;
  totalComments: number;
  totalVotes: number;
};

type ContentItem = {
  id: string;
  title: string;
  author: string;
  updatedAt: string; // ISO 8601 date string, e.g. '2025-08-18T09:00:00Z'
  status?: "published" | "hidden";
};

type CommentItem = {
  id: string;
  excerpt: string;
  by: string;
  on: string; // content title
  at: string; // ISO 8601 date string
};

// ---- Mock fetchers (thay bằng gọi API thật /server actions) ----------------

async function getModDashboardData() {
  // Giả lập dữ liệu; trong dự án thật, gọi Nest API của bạn và trả về cùng shape
  const metrics: Metrics = {
    totalPosts: 42,
    totalLinks: 63,
    totalProducts: 12,
    totalViews: 15240,
    totalComments: 318,
    totalVotes: 907,
  };

  const recentActivity: Array<{ type: "post" | "link" | "product"; title: string; when: string }>= [
    { type: "post", title: "Tối ưu hóa SQL với EXPLAIN ANALYZE", when: "2025-08-18T09:00:00Z" },
    { type: "link", title: "Video: NestJS Guards & Interceptors", when: "2025-08-18T07:00:00Z" },
    { type: "product", title: "Turborepo", when: "2025-08-17T10:00:00Z" },
  ];

  const posts: ContentItem[] = [
    { id: "p1", title: "Hướng dẫn Next.js App Router", author: "you", updatedAt: "2025-08-17T10:30:00Z", status: "published" },
    { id: "p2", title: "So sánh Prisma vs TypeORM", author: "alice", updatedAt: "2025-08-15T12:00:00Z", status: "published" },
  ];
  const links: ContentItem[] = [
    { id: "l1", title: "YouTube: Shadcn UI Crash Course", author: "you", updatedAt: "2025-08-16T20:00:00Z", status: "published" },
  ];
  const products: ContentItem[] = [
    { id: "pr1", title: "Vite", author: "mod-team", updatedAt: "2025-08-14T08:00:00Z", status: "published" },
  ];

  const latestComments: CommentItem[] = [
    { id: "c1", excerpt: "Bài này rất hữu ích, nhưng phần Prisma...", by: "bob", on: "So sánh Prisma vs TypeORM", at: "2025-08-18T01:23:00Z" },
    { id: "c2", excerpt: "Có thể thêm ví dụ về caching không?", by: "mini", on: "Hướng dẫn Next.js App Router", at: "2025-08-17T13:10:00Z" },
  ];

  return { metrics, recentActivity, posts, links, products, latestComments };
}

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  const y = Math.floor(mo / 12);
  return `${y}y ago`;
}

// ---- Page ---------------------------------------------------------------

export default async function ModPage() {
  const { metrics, recentActivity, posts, links, products, latestComments } = await getModDashboardData();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Moderator Dashboard</h1>
          <p className="text-sm text-muted-foreground">Tổng quan nội dung & hoạt động gần đây</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/mod/help">Hướng dẫn viết bài</Link>
          </Button>
          <Button variant="default" className="gap-2" asChild>
            <Link href="/mod?refresh=1">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Button asChild className="justify-start gap-2" variant="secondary">
          <Link href="/mod/posts/new"><FileText className="h-4 w-4" /> Bài viết mới</Link>
        </Button>
        <Button asChild className="justify-start gap-2" variant="secondary">
          <Link href="/mod/links/new"><LinkIcon className="h-4 w-4" /> Thêm Link/Youtube</Link>
        </Button>
        <Button asChild className="justify-start gap-2" variant="secondary">
          <Link href="/mod/products/new"><Box className="h-4 w-4" /> Thêm Sản phẩm</Link>
        </Button>
        <Button asChild className="justify-start gap-2" variant="secondary">
          <Link href="/mod/tags/new"><Tag className="h-4 w-4" /> Thêm Tag</Link>
        </Button>
        <Button asChild className="justify-start gap-2" variant="secondary">
          <Link href="/mod/playlists/new"><ListPlus className="h-4 w-4" /> Tạo Playlist</Link>
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Bài viết" value={metrics.totalPosts} />
        <StatCard title="Links" value={metrics.totalLinks} />
        <StatCard title="Sản phẩm" value={metrics.totalProducts} />
        <StatCard title="Lượt xem" value={metrics.totalViews} />
        <StatCard title="Bình luận" value={metrics.totalComments} />
        <StatCard title="Votes" value={metrics.totalVotes} />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recentActivity.map((it, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <div className="truncate">
                  <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs capitalize mr-2">{it.type}</span>
                  <span className="font-medium">{it.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{timeAgo(it.when)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Latest Content + Search */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Nội dung mới nhất</h2>
        <div className="flex items-center gap-2">
          <Input placeholder="Tìm theo tiêu đề…" className="h-9 w-[260px]" />
        </div>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts">Bài viết</TabsTrigger>
          <TabsTrigger value="links">Links / Youtube</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <ContentTable items={posts} baseHref="/mod/posts" />
        </TabsContent>
        <TabsContent value="links">
          <ContentTable items={links} baseHref="/mod/links" />
        </TabsContent>
        <TabsContent value="products">
          <ContentTable items={products} baseHref="/mod/products" />
        </TabsContent>
      </Tabs>

      {/* Latest Comments */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Bình luận mới nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[44px]"></TableHead>
                <TableHead>Trích đoạn</TableHead>
                <TableHead>Người viết</TableHead>
                <TableHead>Bài viết</TableHead>
                <TableHead className="text-right">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestComments.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-muted-foreground"><MessageCircle className="h-4 w-4" /></TableCell>
                  <TableCell className="max-w-[480px] truncate">{c.excerpt}</TableCell>
                  <TableCell className="capitalize">{c.by}</TableCell>
                  <TableCell className="truncate">{c.on}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{timeAgo(c.at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Components ----------------------------------------------------------

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{formatNumber(value)}</div>
      </CardContent>
    </Card>
  );
}

function ContentTable({ items, baseHref }: { items: ContentItem[]; baseHref: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[44px]">#</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead className="hidden md:table-cell">Cập nhật</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((it, idx) => (
              <TableRow key={it.id}>
                <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                <TableCell className="max-w-[420px] truncate">
                  <Link href={`${baseHref}/${it.id}/edit`} className="hover:underline">
                    {it.title}
                  </Link>
                </TableCell>
                <TableCell className="capitalize">{it.author}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{timeAgo(it.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="outline" asChild>
                      <Link href={`${baseHref}/${it.id}/edit`} aria-label="Edit">
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="icon" variant="outline" asChild>
                      <Link href={`${baseHref}/${it.id}/hide`} aria-label="Hide">
                        <EyeOff className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="icon" variant="destructive" asChild>
                      <Link href={`${baseHref}/${it.id}/delete`} aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
