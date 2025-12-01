import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Headline */}
          <h2 className="mb-4 text-3xl font-bold tracking-[-0.02em] text-gray-950 md:text-4xl">
            Sẵn sàng học nghiêm túc?
          </h2>
          <p className="mb-8 text-lg text-gray-500">
            Tham gia cộng đồng hàng nghìn developers đang học lập trình một cách
            có hệ thống.
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            className="h-12 gap-2 bg-gray-950 px-8 text-base text-white hover:bg-gray-800"
            asChild
          >
            <Link href="/signup">
              Tham gia Dev Wiki (Miễn phí)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {/* Trust Note */}
          <p className="mt-6 text-sm text-gray-400">
            Không cần thẻ tín dụng • Đăng ký trong 30 giây
          </p>
        </div>
      </div>
    </section>
  );
}
