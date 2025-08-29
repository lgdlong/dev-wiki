"use client";

import { Input } from "@/components/ui/input";
import { useRef, useEffect } from "react";

export function TagSearchBox({
  value,
  onChange,
  onEnter,
  onEsc,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  onEsc?: () => void;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => ref.current?.focus(), 0);
    }
  }, [autoFocus]);

  return (
    <Input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onEnter) {
          e.preventDefault();
          onEnter();
        }
        if (e.key === "Escape" && onEsc) {
          e.preventDefault();
          onEsc();
        }
      }}
      placeholder="Search or add a tag…"
      className="h-9 w-full rounded-lg border border-white/10 bg-black text-sm placeholder-white/40 focus:ring-2 focus:ring-white/10"
    />
  );
}
