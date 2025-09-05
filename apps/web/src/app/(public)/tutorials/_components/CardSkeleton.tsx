"use client";

export default function CardSkeleton() {
  return (
    <li className="animate-pulse">
      <div className="h-full p-4 border rounded-lg border-gray-200 dark:border-gray-700">
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </li>
  );
}
