// apps/web/src/lib/fetcher.ts
import { API_URL } from "@/config/api";

export async function fetcher(path: string, options?: RequestInit) {
  const url = `${API_URL}${path}`;
  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
  } catch (err) {
    console.error("Fetch error:", err);
    // Lỗi do không kết nối được đến server (mạng lỗi, backend không chạy,...)
    throw new Error("Could not connect to server. Please try again later.");
  }

  let data: unknown = null;
  const contentType = res.headers.get("content-type") || "";

  // Nếu backend trả về JSON thì parse, còn không thì trả về text hoặc null
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      data = await res.text();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    // Trường hợp có trả về lỗi dạng JSON với message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasMessage = (obj: unknown): obj is { message: string } => {
      return (
        typeof obj === "object" &&
        obj !== null &&
        "message" in obj &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (obj as any).message === "string"
      );
    };

    if (hasMessage(data)) {
      throw new Error(data.message);
    }
    // Nếu trả về lỗi dạng text hoặc lỗi khác
    if (typeof data === "string" && data.length > 0) {
      throw new Error(data);
    }
    // Nếu không có gì thì dùng statusText hoặc generic
    throw new Error(res.statusText || "API error");
  }

  return data;
}
