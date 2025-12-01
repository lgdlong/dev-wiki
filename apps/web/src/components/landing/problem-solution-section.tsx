import { X, Check } from "lucide-react";

export function ProblemSolutionSection() {
  return (
    <section className="border-y border-gray-200 bg-gray-50/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-[-0.02em] text-gray-950 md:text-4xl">
            Tại sao Dev Wiki?
          </h2>
          <p className="text-lg text-gray-500">
            So sánh trải nghiệm tìm kiếm video học lập trình
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* The Problem */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <X className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400">
                Youtube Search
              </h3>
            </div>

            <ul className="space-y-4">
              {[
                "Kết quả hỗn độn, không theo lộ trình",
                "Video cũ, outdated, không còn áp dụng được",
                "Clickbait thumbnails, nội dung rỗng",
                "Quảng cáo xen kẽ, mất tập trung",
                "Không có bộ lọc theo công nghệ cụ thể",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs">
                    ✗
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* The Solution */}
          <div className="rounded-xl border-2 border-gray-950 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-950">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-950">
                Dev Wiki Search
              </h3>
            </div>

            <ul className="space-y-4">
              {[
                "Bộ lọc Strict Tags (React + Hooks + 2024)",
                "Chỉ video mới, được cập nhật liên tục",
                "Nội dung được kiểm duyệt chất lượng",
                "Giao diện tập trung, không quảng cáo",
                "Lộ trình học bài bản từ cơ bản đến nâng cao",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-950 text-xs text-white">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
