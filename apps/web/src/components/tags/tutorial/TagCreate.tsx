"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

export function TagCreateButton({
  canCreate,
  creating,
  onCreate,
  name,
}: {
  canCreate: boolean;
  creating: boolean;
  onCreate: () => void;
  name: string;
}) {
  if (!canCreate) return null;
  return (
    <Button
      type="button"
      size="sm"
      onClick={onCreate}
      disabled={creating}
      className="gap-2"
    >
      {creating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Create “{name}”
    </Button>
  );
}
