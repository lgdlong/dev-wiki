"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTutorialsByTagName } from "@/utils/api/tutorialApi";
import type { Tutorial } from "@/types/tutorial";
import TutorialCard from "@/app/(public)/tutorials/_components/TutorialCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash, ChevronLeft } from "lucide-react";

export default function TagTutorialsPage() {
  const params = useParams();
  const router = useRouter();
  const tagName = decodeURIComponent(String(params.name));
  const {
    data: tutorials = [],
    isLoading,
    isError,
  } = useQuery<Tutorial[]>({
    queryKey: ["tutorials-by-tag", tagName],
    queryFn: () => getTutorialsByTagName(tagName),
    enabled: !!tagName,
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/tutorials")}
            className="-ml-3 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to all tutorials
          </Button>
        </div>

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              <Hash className="h-8 w-8 text-primary" />
              {tagName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Danh sách bài viết với tag{" "}
              <span className="font-semibold text-foreground">{tagName}</span>.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="space-y-2 p-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-2 pt-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))
          ) : isError ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-destructive">
                Không thể tải bài viết cho tag "{tagName}".
              </p>
              <Button
                variant="link"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Thử lại
              </Button>
            </div>
          ) : tutorials.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              Không có bài viết nào cho tag{" "}
              <span className="font-semibold">#{tagName}</span>.
            </div>
          ) : (
            tutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
