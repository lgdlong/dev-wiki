// apps/web/src/lib/fetcher.ts
import { API_URL } from "@/config/api";

export class ApiError extends Error {
  status: number;
  // payload gốc từ server (nếu có), để debug/hiển thị chi tiết hơn khi cần
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type JsonLike =
  | { message?: string | string[]; error?: string; statusCode?: number }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, any>;

/**
 * Fetch helper cho toàn bộ API (generic).
 * - Tự parse JSON hoặc text.
 * - Ném ApiError khi !res.ok, message gộp mượt.
 */
export async function fetcher<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${path}`;

  // Chỉ set Content-Type khi có body JSON
  const hasBody = typeof options.body !== "undefined";
  const headers: HeadersInit = {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err) {
    console.error("Network error:", err);
    throw new ApiError(
      "Could not connect to server. Please try again later.",
      0,
    );
  }

  // Thử parse JSON trước, nếu fail thì lấy text
  let json: JsonLike | undefined;
  let text: string | undefined;

  const tryParseJson = async () => {
    try {
      json = await res.clone().json();
    } catch {
      json = undefined;
    }
  };
  const tryParseText = async () => {
    try {
      text = await res.clone().text();
    } catch {
      text = undefined;
    }
  };

  await tryParseJson();
  if (json === undefined) {
    await tryParseText();
  }

  if (!res.ok) {
    // Ưu tiên message từ JSON
    let message = `HTTP ${res.status} ${res.statusText || "Error"}`;

    if (json) {
      const maybeMsg = (json as JsonLike).message;
      const maybeErr = (json as JsonLike).error;

      if (Array.isArray(maybeMsg)) {
        message = maybeMsg.join(", ");
      } else if (typeof maybeMsg === "string" && maybeMsg.trim()) {
        message = maybeMsg;
      } else if (typeof maybeErr === "string" && maybeErr.trim()) {
        message = maybeErr;
      } else {
        // fallback: stringify ngắn gọn
        try {
          message = JSON.stringify(json);
        } catch {
          /* ignore */
        }
      }
    } else if (text && text.trim()) {
      message = text;
    }

    throw new ApiError(message, res.status, json ?? text);
  }

  // 204 No Content → trả undefined
  if (res.status === 204) {
    return undefined as T;
  }

  // Ưu tiên trả JSON nếu có
  if (json !== undefined) {
    return json as T;
  }

  // Nếu API trả text mà generic của bạn expecting string
  if (typeof text === "string") {
    return text as unknown as T;
  }

  // Không có gì để trả
  return undefined as T;
}
