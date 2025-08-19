// hooks/useTagSearch.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Tag } from "@/types/tag";
import { searchTags } from "@/utils/api/tag";
import { normalizeTagName } from "@/utils/youtube";

/** Simple LRU cache (Map-based) */
class LRU<K, V> {
  private cap: number;
  private map = new Map<K, V>();
  constructor(cap = 100) {
    this.cap = cap;
  }
  get(key: K) {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  set(key: K, val: V) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.cap) {
      const firstKey = this.map.keys().next().value as K;
      this.map.delete(firstKey);
    }
  }
  clear() {
    this.map.clear();
  }
}

type SearchResp = { items: Tag[]; nextCursor: string | null };

type Options = {
  /** Bắt đầu search khi đủ ký tự (mặc định 2) */
  minChars?: number;
  /** Kích thước trang (mặc định 10) */
  pageSize?: number;
  /** Thời gian debounce ms (mặc định 250) */
  debounceMs?: number;
  /** Cho phép bật/tắt hook (mặc định true) */
  enabled?: boolean;
  /** Query khởi tạo (mặc định "") */
  initialQuery?: string;
  /** Callback lỗi */
  onError?: (err: unknown) => void;
  /** Dung lượng cache */
  cacheCap?: number;
};

const sharedCache = new LRU<string, SearchResp>(100);

/**
 * useTagSearch — debounce + abort + cursor + LRU cache.
 * Prefix search phía server: GET /tags/search?q=&limit=&cursor=
 */
export function useTagSearch(opts: Options = {}) {
  const {
    minChars = 2,
    pageSize = 10,
    debounceMs = 250,
    enabled = true,
    initialQuery = "",
    onError,
    cacheCap = 100,
  } = opts;

  // nếu muốn cache riêng cho mỗi instance:
  // const cacheRef = useRef(new LRU<string, SearchResp>(cacheCap));
  // const cache = cacheRef.current;
  // dùng shared cache cho toàn app (tiết kiệm request hơn):
  const cache = sharedCache;
  // đồng bộ cap nếu khác
  // (đơn giản bỏ qua; hoặc tạo nhiều cache theo cap)

  const [q, setQ] = useState(initialQuery);
  const [items, setItems] = useState<Tag[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);

  const fetchPage = useCallback(
    async (query: string, cursor?: string | null) => {
      const key = `${query}::${cursor ?? ""}::${pageSize}`;
      const cached = cache.get(key);
      if (cached) {
        // dùng cache
        if (!cursor) setItems(cached.items);
        else setItems((prev) => [...prev, ...cached.items]);
        setNextCursor(cached.nextCursor);
        setHasSearched(true);
        return;
      }

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setLoading(true);
      try {
        const res = await searchTags(query, pageSize, cursor ?? undefined);
        cache.set(key, res);
        if (!cursor) setItems(res.items);
        else setItems((prev) => [...prev, ...res.items]);
        setNextCursor(res.nextCursor);
        setHasSearched(true);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          onError?.(err);
          // tuỳ chọn: giữ state cũ, không xoá items
        }
      } finally {
        setLoading(false);
      }
    },
    [cache, onError, pageSize],
  );

  // Debounce khi q đổi
  useEffect(() => {
    if (!enabled) return;

    const query = normalizeTagName(q);

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    if (query.length < minChars) {
      setItems([]);
      setNextCursor(null);
      setHasSearched(false);
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      fetchPage(query, null);
    }, debounceMs) as unknown as number;

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [q, enabled, minChars, debounceMs, fetchPage]);

  const loadMore = useCallback(() => {
    if (!enabled) return;
    if (!nextCursor) return;
    const query = q.trim().toLowerCase();
    fetchPage(query, nextCursor);
  }, [enabled, nextCursor, q, fetchPage]);

  /** Clear toàn bộ state (không xoá cache dùng chung) */
  const reset = useCallback(() => {
    setItems([]);
    setNextCursor(null);
    setHasSearched(false);
  }, []);

  return {
    // state
    q,
    items,
    nextCursor,
    loading,
    hasSearched,
    // actions
    setQ,
    loadMore,
    reset,
  };
}
