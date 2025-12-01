"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import TagBadgeList, { Tag } from "./TagBadgeList";
import TagSearch from "./TagSearch";
import TagCreate from "./TagCreate";

type Props = {
  allTags: Tag[];
  linkedTags: Tag[];
  query: string;
  creating?: boolean;
  onQueryChange: (v: string) => void;
  onAdd: (tag: Tag) => void;
  onRemove: (id: number) => void;
  onCreate: (name: string) => void;
};

export default function TagManager({
  allTags,
  linkedTags,
  query,
  creating,
  onQueryChange,
  onAdd,
  onRemove,
  onCreate,
}: Props) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-base">Tag management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Current tags */}
        <section className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Tags linked to this video
          </div>
          <TagBadgeList
            tags={linkedTags}
            onRemove={onRemove}
            emptyText="No tags yet. Add tags below."
          />
        </section>

        <Separator />

        {/* Search existing */}
        <section className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Search & add existing tags
          </div>
          <TagSearch
            linkedIds={linkedTags.map((t) => t.id)}
            onPick={onAdd} // onAdd: (tag) => setLinkedTags([...])
            minChars={2}
            pageSize={10}
          />
        </section>

        {/* Create new */}
        <section className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Can’t find it? Create a new tag:
          </div>
          <TagCreate
            value={query}
            creating={creating}
            onChange={onQueryChange}
            onCreate={onCreate}
          />
        </section>
      </CardContent>
    </Card>
  );
}
