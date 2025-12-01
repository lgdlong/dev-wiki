import { Clock, Play } from "lucide-react";

const previewVideos = [
  {
    title: "Deep Dive into Server Actions",
    duration: "12:45",
    channel: "Fireship",
    thumbnail: "/placeholder-video-1.jpg",
    tags: ["Next.js", "React"],
  },
  {
    title: "Building a Full-Stack App with Prisma",
    duration: "28:30",
    channel: "Theo",
    thumbnail: "/placeholder-video-2.jpg",
    tags: ["Prisma", "TypeScript"],
  },
  {
    title: "React 19 New Features Explained",
    duration: "15:20",
    channel: "Jack Herrington",
    thumbnail: "/placeholder-video-3.jpg",
    tags: ["React", "2024"],
  },
];

export function PreviewSection() {
  return (
    <section className="border-y border-gray-200 bg-gray-50/50 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-[-0.02em] text-gray-950 md:text-4xl">
            Giao diện tập trung vào nội dung
          </h2>
          <p className="text-lg text-gray-500">
            Thiết kế tối giản, giúp bạn tập trung hoàn toàn vào việc học
          </p>
        </div>

        {/* Video Grid Preview */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewVideos.map((video, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                {/* Placeholder gradient as thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-950/80 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-6 w-6 translate-x-0.5" fill="white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-gray-950/80 px-2 py-1 text-xs font-medium text-white">
                  <Clock className="h-3 w-3" />
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-2 line-clamp-2 font-semibold leading-snug text-gray-950">
                  {video.title}
                </h3>
                <p className="mb-3 text-sm text-gray-500">{video.channel}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {video.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Link */}
        <div className="mt-12 text-center">
          <a
            href="/videos"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 underline-offset-4 hover:text-gray-950 hover:underline"
          >
            Xem tất cả video
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
