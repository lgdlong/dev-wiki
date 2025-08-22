'use client';
import { useState, useEffect } from 'react';

type BannerKind = 'error' | 'success' | 'warning' | 'info';

export default function TopBanner({
  message,
  kind = 'error',
  open = false,
  autoHideMs,
}: {
  message: string;
  kind?: BannerKind;
  open?: boolean;
  autoHideMs?: number; // optional: tự ẩn sau X ms
}) {
  const [show, setShow] = useState(open);

  useEffect(() => setShow(open), [open]);

  useEffect(() => {
    if (!autoHideMs || !show) return;
    const t = setTimeout(() => setShow(false), autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, show]);

  if (!show) return null;

  const styles: Record<BannerKind, string> = {
    error: 'bg-rose-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-500',
    info: 'bg-sky-600',
  };

  return (
    <div className={`sticky top-0 z-[1000] w-full ${styles[kind]} text-white`}>
      <div className="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between">
        <p className="font-medium">{message}</p>
        <button
          onClick={() => setShow(false)}
          className="px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25"
          aria-label="Close banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}


// TopBanner(hiện chưa xài cho ai cả) 

// Dùng cho thông báo “toàn cục” / nghiêm trọng / cần user chú ý nhiều
// Error/sự cố lớn → TopBanner (lỗi server, downtime, cần user thao tác).

// Ví dụ:

// Lỗi hệ thống (“Không kết nối được DB”, “API bảo trì lúc 23h–23h15”).
// Warning quan trọng (“Bạn chưa xác minh email, vui lòng xác minh để tiếp tục”).
// Success nhưng mang tính toàn app (ví dụ cập nhật cấu hình hệ thống thành công).

// Ưu điểm:
// Luôn nằm ở top, dễ thấy.
// Có nút đóng thủ công.
// Có thể tự ẩn bằng autoHideMs.
// Hỗ trợ nhiều màu (error, success, warning, info).

// Nhược điểm:
// Toàn màn hình, hơi “phá flow” nếu spam nhiều.