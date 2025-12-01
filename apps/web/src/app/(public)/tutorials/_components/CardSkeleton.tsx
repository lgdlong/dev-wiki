"use client";

export default function CardSkeleton() {
  return (
    <li className="animate-pulse">
      <div className="h-full p-6 bg-white border border-transparent rounded-none shadow-sm">
        {/* Meta line */}
        <div className="flex gap-2 mb-4">
          <div className="h-3 w-20 bg-zinc-200 rounded" />
          <div className="h-3 w-16 bg-zinc-200 rounded" />
        </div>

        {/* Title lines */}
        <div className="h-6 w-full bg-zinc-200 rounded mb-2" />
        <div className="h-6 w-2/3 bg-zinc-200 rounded mb-6" />

        {/* Footer line */}
        <div className="mt-auto pt-2 flex justify-between">
          <div className="h-4 w-16 bg-zinc-200 rounded" />
          <div className="h-4 w-24 bg-zinc-200 rounded" />
        </div>
      </div>
    </li>
  );
}
