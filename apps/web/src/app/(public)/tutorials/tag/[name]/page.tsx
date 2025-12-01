"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTutorialsByTagName } from "@/utils/api/tutorialApi";
import type { Tutorial } from "@/types/tutorial";
import { TutorialGrid } from "@/components/tutorials/tutorial-grid";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-background">
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
        {isError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 py-12 text-center">
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
        ) : (
          <TutorialGrid
            tutorials={tutorials}
            isLoading={isLoading}
            skeletonCount={6}
          />
        )}
      </div>
    </div>
  );
}
