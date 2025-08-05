export interface YoutubeMetadata {
  title?: string;
  description?: string;
  thumbnail?: string;
  duration?: number;
  channelTitle?: string;
  tags?: string[];
  [key: string]: any; // Cho phép lưu thêm trường bất kỳ
}
