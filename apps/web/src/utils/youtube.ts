// utils/youtube.ts

/**
 * Get YouTube thumbnail URL by videos ID
 * @param youtubeId - YouTube videos ID
 * @param quality - one of: "default" | "mq" | "hq" | "maxres"
 * @returns thumbnail URL string
 */
export function getYoutubeThumbnail(
  youtubeId: string,
  quality: "default" | "mq" | "hq" | "maxres" = "mq",
): string {
  if (!youtubeId) return "";

  const qualityMap: Record<typeof quality, string> = {
    default: "default.jpg", // 120x90
    mq: "mqdefault.jpg", // 320x180
    hq: "hqdefault.jpg", // 480x360
    maxres: "maxresdefault.jpg", // 1280x720 (if available)
  };

  return `https://i.ytimg.com/vi/${youtubeId}/${qualityMap[quality]}`;
}

/**
 * Get YouTube embed URL by videos ID
 * @param youtubeId - YouTube videos ID
 * @returns embed URL string
 */
export function getYoutubeEmbedUrl(youtubeId?: string | null): string {
  if (!youtubeId) return "";
  return `https://www.youtube.com/embed/${youtubeId}`;
}

/** Định dạng thời lượng thành HH:MM:SS */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null) return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

/**
 * Chuẩn hoá tên tag: lowercase, không dấu, kebab-case. NFD = Normalization Form Decomposition
 *
 * @param raw - tên gốc
 * @returns tên đã chuẩn hoá
 */
export function normalizeTagName(raw: string): string {
  // Precompiled regexes (tạo 1 lần)
  const NON_ASCII = /[^\x00-\x7F]/; // phát hiện có ký tự non-ASCII
  const DIACRITICS = /[\u0300-\u036f]/g; // dấu kết hợp (combining marks)
  const NON_ALNUM = /[^a-z0-9]+/g; // nhóm ký tự -> "-"
  const EDGE_DASH = /^-+|-+$/g;

  if (!raw) return "";

  let s = raw.trim();
  // Chỉ normalize nếu có non-ASCII (tiết kiệm đáng kể cho input “bình thường”)
  if (NON_ASCII.test(s)) {
    s = s.normalize("NFD").replace(DIACRITICS, "");
    // Map đ/Đ (không bị tách dấu bởi NFD)
    s = s.replace(/\u0111/g, "d").replace(/\u0110/g, "D");
  }

  // Lowercase một lần
  s = s.toLowerCase();

  // Kebab-case: thay mọi cụm non-alnum bằng "-", rồi bỏ "-" dư ở mép
  s = s.replace(NON_ALNUM, "-").replace(EDGE_DASH, "");

  return s;
}
