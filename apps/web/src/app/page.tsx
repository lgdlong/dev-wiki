"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  PlayCircle,
  Rocket,
  Terminal,
  Code2,
  Users,
  Cpu,
  CheckCircle2,
  Search,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { data: user, isLoading } = useCurrentUser();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 1. HERO SECTION: Căn lề trái */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Container: text-left, bỏ mx-auto ở các thẻ con */}
        <div className="container relative z-10 mx-auto px-4 text-left max-w-5xl">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-sm">
            <Badge
              variant="secondary"
              className="rounded-full px-2 py-0.5 text-xs"
            >
              New
            </Badge>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Dev Wiki Public Beta is live
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Nền tảng tri thức <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              All-in-One
            </span>{" "}
            cho Developer.
          </h1>

          {/* Bỏ mx-auto để text căn trái */}
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            Không còn phải tìm kiếm rời rạc. Dev Wiki tập hợp{" "}
            <strong>Tutorials chuyên sâu</strong>,
            <strong> Video chọn lọc</strong> và{" "}
            <strong>Công cụ lập trình</strong> mới nhất vào một nơi duy nhất.
          </p>

          {/* Justify-start để căn trái nút bấm */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4">
            {isLoading ? (
              <Button disabled className="h-12 px-8 rounded-full">
                Đang tải...
              </Button>
            ) : user ? (
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-full text-base font-medium shadow-lg shadow-blue-500/20"
              >
                <Link href={user.role === "admin" ? "/admin" : "/mod"}>
                  Vào Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 rounded-full text-base font-medium shadow-lg shadow-blue-500/20"
                >
                  <Link href="/signup">
                    Bắt đầu học ngay <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 rounded-full text-base font-medium bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <Link href="/tutorials">Khám phá nội dung</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
      {/* 2. PROBLEM & SOLUTION: Tại sao lại cần Dev Wiki? */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Học lập trình không nên phức tạp đến thế
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Chúng tôi giải quyết vấn đề phân mảnh kiến thức bằng cách quy tụ
              mọi nguồn tài nguyên bạn cần để phát triển sự nghiệp IT.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Vấn đề 1: Tài liệu rời rạc */}
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">
                Tạm biệt việc tìm kiếm rời rạc
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Thay vì mở 20 tab Chrome để tìm tutorial, video và docs, bạn chỉ
                cần một tab Dev Wiki. Tất cả được phân loại, gắn tag và kiểm
                duyệt kỹ lưỡng.
              </p>
            </div>

            {/* Vấn đề 2: Onboarding chậm */}
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Tăng tốc độ Onboarding</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Dành cho các team lead: Dev Wiki là nơi lý tưởng để lưu trữ tri
                thức nội bộ, giúp thành viên mới nắm bắt công nghệ và quy trình
                nhanh gấp đôi.
              </p>
            </div>

            {/* Vấn đề 3: Lạc hậu công nghệ */}
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Cập nhật xu hướng Tech</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Khám phá các thư viện, framework và công cụ dev mới nhất mỗi
                ngày thông qua module Product Discovery, tương tự Product Hunt
                dành riêng cho Dev.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* 3. CORE MODULES: Trang web làm cái gì? */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Hệ sinh thái nội dung toàn diện
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              3 module chính tạo nên sức mạnh của Dev Wiki.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Module 1: Tutorials */}
            <div className="relative group rounded-3xl bg-zinc-100 dark:bg-zinc-900 p-8 hover:bg-zinc-200 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Tech Tutorials</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 min-h-[80px]">
                Bài viết chuyên sâu với Markdown, Code highlighting và giải
                thích chi tiết. Từ cơ bản đến nâng cao.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Không giới
                  hạn độ dài
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Syntax
                  highlighting đẹp mắt
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Cập nhật
                  liên tục
                </li>
              </ul>
              <Button asChild variant="default" className="w-full rounded-xl">
                <Link href="/tutorials">Đọc Tutorials</Link>
              </Button>
            </div>

            {/* Module 2: Videos */}
            <div className="relative group rounded-3xl bg-zinc-100 dark:bg-zinc-900 p-8 hover:bg-zinc-200 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm">
                <PlayCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Curated Videos</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 min-h-[80px]">
                Tuyển tập video Youtube chất lượng cao nhất cho từng chủ đề.
                Được phân loại theo tag và playlist rõ ràng.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Tự động
                  lấy Metadata
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Playlist
                  theo lộ trình
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Bookmark
                  xem sau
                </li>
              </ul>
              <Button asChild variant="default" className="w-full rounded-xl">
                <Link href="/videos">Xem Video</Link>
              </Button>
            </div>

            {/* Module 3: Products */}
            <div className="relative group rounded-3xl bg-zinc-100 dark:bg-zinc-900 p-8 hover:bg-zinc-200 dark:hover:bg-zinc-800/80 transition-colors">
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm">
                <Rocket className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Product Discovery</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-6 min-h-[80px]">
                Nơi khám phá các công cụ hỗ trợ lập trình mới nhất. Xem đánh
                giá, ưu nhược điểm và bình chọn.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Thông tin
                  chi tiết (Pros/Cons)
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Link
                  Github & Homepage
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Cộng đồng
                  Review
                </li>
              </ul>
              <Button asChild variant="default" className="w-full rounded-xl">
                <Link href="/products">Săn Tools Mới</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-foreground rounded-lg flex items-center justify-center text-background font-bold text-xl">
                D
              </div>
              <span className="font-bold text-lg">Dev Wiki</span>
            </div>

            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} Dev Wiki. Built with passion for
              Developers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
