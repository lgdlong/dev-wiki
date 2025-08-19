// src/videos/mappers/videos.mapper.ts
import { Video } from 'src/videos/entities/video.entity';
import { RequestCreateVideo } from 'src/videos/interfaces/request-create-video.interface';
import { YoutubeMetadata } from 'src/videos/interfaces/youtube-metadata.interface';

// Hàm mapper thuần, không dính DI, không dùng this
export function toVideoEntity(
  request: RequestCreateVideo,
  metadata: YoutubeMetadata,
): Partial<Video> {
  if (!request.youtubeId) throw new Error('YouTube ID is required');
  if (!metadata) throw new Error('Invalid YouTube metadata');

  // Map fields đúng entity
  return {
    youtubeId: request.youtubeId,
    title: metadata.title,
    uploaderId: request.uploaderId || 0,
    description: metadata.description,
    thumbnailUrl: metadata.thumbnail,
    duration: metadata.duration,
    channelTitle: metadata.channelTitle,
    metadata, // nếu Video entity có field metadata (jsonb)
  };
}
