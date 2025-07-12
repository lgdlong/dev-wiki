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
    <div className="min-h-screen flex flex-col items-center justify-center bg-zenc-950 text-white p-6">
      <h2 className="text-2xl font-bold mb-4 text-zenc-50">Đã xảy ra lỗi!</h2>
      <p className="mb-8 text-zenc-50">
        {error.message || "Something went wrong."}
      </p>
      <button
        className="px-4 py-2 rounded-full bg-zenc-950 border-2 text-white font-semibold"
        onClick={() => reset()}
      >
        Thử lại
      </button>
    </div>
  );
}
