"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { isValidTagName } from "@/utils/tag";

type Props = {
  value: string;
  creating?: boolean;
  onChange: (v: string) => void;
  onCreate: (name: string) => void; // gửi nguyên xi
};

export default function TagCreate({
  value,
  creating,
  onChange,
  onCreate,
}: Props) {
  const trimmed = useMemo(() => value.trim(), [value]);
  const valid = useMemo(() => isValidTagName(trimmed), [trimmed]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. react, nestjs, ci-cd"
        />
        <Button
          type="button"
          onClick={() => valid && onCreate(trimmed)}
          disabled={creating || !trimmed || !valid}
        >
          {creating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create & attach
            </>
          )}
        </Button>
      </div>

      {!trimmed ? (
        <p className="text-xs text-muted-foreground">
          Enter tag name in lowercase, numbers, and hyphens.{" "}
          <code>e.g. react, nestjs, ci-cd</code>
        </p>
      ) : valid ? (
        <p className="text-xs text-green-600">Valid.</p>
      ) : (
        <p className="text-xs text-red-500">
          Invalid format. <br /> Only lowercase letters/numbers, hyphens between
          groups and must not start or end with “-” <br /> (e.g. react, nestjs,
          ci-cd).
        </p>
      )}
    </div>
  );
}
