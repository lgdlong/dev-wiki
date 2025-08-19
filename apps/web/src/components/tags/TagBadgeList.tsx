"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export type Tag = { id: number; name: string; slug?: string };

type Props = {
  tags: Tag[];
  onRemove?: (id: number) => void;
  emptyText?: string;
};

export default function TagBadgeList({ tags, onRemove, emptyText }: Props) {
  if (!tags.length) {
    return (
      <div className="text-sm text-muted-foreground">
        {emptyText ?? "No tags yet."}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag.id} variant="secondary" className="px-2 py-1 gap-1">
          {tag.name}
          {onRemove && (
            <button
              aria-label={`Remove ${tag.name}`}
              className="ml-1 inline-flex rounded hover:bg-muted"
              onClick={() => onRemove(tag.id)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}
