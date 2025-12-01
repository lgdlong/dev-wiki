import { Tag, ShieldCheck, FileText, Sparkles } from "lucide-react";

const features = [
  {
    icon: Tag,
    title: "Smart Tags Filtering",
    description:
      "Lọc video theo công nghệ cụ thể: React, Next.js, TypeScript, Prisma... Kết hợp nhiều tags để tìm chính xác những gì bạn cần.",
    tags: ["#NextJS", "#Prisma", "#TypeScript"],
  },
  {
    icon: ShieldCheck,
    title: "Curated Content",
    description:
      "Mỗi video đều được review và đánh giá chất lượng. Chỉ những nội dung thực sự có giá trị mới được thêm vào thư viện.",
  },
  {
    icon: FileText,
    title: "Structured Tutorials",
    description:
      "Các bài viết hướng dẫn chi tiết, được tổ chức theo chủ đề và độ khó. Học từ cơ bản đến nâng cao một cách có hệ thống.",
  },
  {
    icon: Sparkles,
    title: "Continuously Updated",
    description:
      "Thư viện được cập nhật hàng tuần với những video và tutorial mới nhất. Luôn bắt kịp xu hướng công nghệ.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-[-0.02em] text-gray-950 md:text-4xl">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-gray-500">
            Những công cụ giúp bạn học lập trình hiệu quả hơn
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              {/* Icon */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 transition-colors group-hover:border-gray-300 group-hover:bg-gray-100">
                <feature.icon className="h-6 w-6 text-gray-700" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-gray-950">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-gray-500">
                {feature.description}
              </p>

              {/* Tags Preview (for first feature) */}
              {feature.tags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
