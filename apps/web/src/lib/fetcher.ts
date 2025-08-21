// apps/web/src/lib/fetcher.ts
import { API_URL } from "@/config/api";

/**
 * Hàm fetcher dùng cho mọi API, hỗ trợ generic type, trả về dữ liệu đúng type.
 * @param path - endpoint (bắt đầu bằng dấu /)
 * @param options - RequestInit (method, body, headers, ...)
 */
export async function fetcher<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
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
    // Log chi tiết lỗi để dễ debug
    console.error("API ERROR", {
      url,
      status: res.status,
      statusText: res.statusText,
      payload: data,
    });


    // Nếu BE trả { message: [...], error, statusCode }
    if (data && typeof data === "object" && Array.isArray((data as any).message)) {
      const msg = (data as any).message
        .map((x: any) => (typeof x === "string" ? x : x?.message || JSON.stringify(x)))
        .join(", ");
      throw new Error(`${res.status} ${res.statusText} — ${msg}`);
    }
    // Trường hợp có trả về lỗi dạng JSON với message
    const hasMessage = (obj: unknown): obj is { message: string } =>
      typeof obj === "object" &&
      obj !== null &&
      "message" in obj &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (obj as any).message === "string";

    if (hasMessage(data)) {
      throw new Error(data.message);
    }
    if (typeof data === "string" && data.length > 0) {
      throw new Error(data);
    }
    throw new Error(res.statusText || "API error");
  }

  // Trả về đúng kiểu dữ liệu
  return data as T;
}
