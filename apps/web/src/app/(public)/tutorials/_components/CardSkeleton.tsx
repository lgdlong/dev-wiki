"use client";

export default function CardSkeleton() {
  return (
    <li className="animate-pulse">
      <div className="h-full p-4 border rounded-lg">
        <div className="h-5 w-3/4 bg-zinc-200 rounded mb-3" />
        <div className="h-4 w-full bg-zinc-200 rounded mb-2" />
        <div className="h-4 w-2/3 bg-zinc-200 rounded" />
      </div>
    </li>
  );
}
