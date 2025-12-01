"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optional: log error về server
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-900 p-6">
      <h2 className="text-2xl font-bold mb-4 text-zinc-50">Đã xảy ra lỗi!</h2>
      <p className="mb-8 text-zinc-700">
        {error.message || "Đã có lỗi xảy ra."}
      </p>
      <button
        className="px-4 py-2 rounded-full bg-white border-2 border-zinc-300 text-zinc-900 font-semibold hover:bg-zinc-100 transition"
        onClick={() => reset()}
      >
        Thử lại
      </button>
    </div>
  );
}
