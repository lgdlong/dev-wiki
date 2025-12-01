import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Dot Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
            <span className="text-base">🚀</span>
            <span>Phiên bản Beta đã ra mắt</span>
          </div>

          {/* Headline */}
          <h1
            className="mb-6 text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-gray-950 md:text-5xl lg:text-6xl"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Học lập trình qua Video.
            <br />
            <span className="text-gray-400">Có chọn lọc. Có lộ trình.</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-500">
            Dev Wiki loại bỏ sự nhiễu loạn của Youtube. Chúng tôi cung cấp các
            video chất lượng cao, được gắn Tags chính xác và sắp xếp theo lộ
            trình bài bản.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 gap-2 bg-gray-950 px-6 text-white hover:bg-gray-800"
              asChild
            >
              <Link href="/videos">
                Khám phá Thư viện
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 gap-2 border-gray-300 px-6"
              asChild
            >
              <Link href="/tutorials">
                <Play className="h-4 w-4" />
                Xem Tutorials
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 flex items-center justify-center gap-8 border-t border-gray-100 pt-8 md:gap-16">
            <div className="text-center">
              <div className="text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
                500+
              </div>
              <div className="text-sm text-gray-500">Videos</div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
                50+
              </div>
              <div className="text-sm text-gray-500">Tutorials</div>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <div className="text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
                100%
              </div>
              <div className="text-sm text-gray-500">Miễn phí</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
