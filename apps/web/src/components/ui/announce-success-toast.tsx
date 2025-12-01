"use client";
import { useEffect } from "react";

export type ToastKind = "success" | "error" | "info";

export function Toast({
  open,
  kind = "success",
  message,
  onClose,
  duration = 2500,
}: {
  open: boolean;
  kind?: ToastKind;
  message: string;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const color =
    kind === "success"
      ? "bg-emerald-600"
      : kind === "error"
        ? "bg-rose-600"
        : "bg-slate-700";

  return (
    <div className="fixed right-4 bottom-4 z-[9999]">
      <div className={`${color} text-white rounded-xl shadow-lg px-4 py-3`}>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
