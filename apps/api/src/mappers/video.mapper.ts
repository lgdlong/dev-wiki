// src/videos/mappers/video.mapper.ts
import { Video } from 'src/videos/entities/video.entity';
import { RequestCreateVideo } from 'src/videos/interfaces/request-create-video.interface';
import { YoutubeMetadata } from 'src/videos/interfaces/youtube-metadata.interface';

// Hàm mapper thuần, không dính DI, không dùng this
export function toVideoEntity(
  request: RequestCreateVideo,
  metadata: YoutubeMetadata,
): Partial<Video> {
  if (!request.youtubeId) throw new Error('YouTube ID is required');
  if (!metadata || !metadata.title || !metadata.channelTitle)
    throw new Error('Invalid YouTube metadata');

  // Map fields đúng entity
  return {
    youtubeId: request.youtubeId,
    title: metadata.title,
    uploader: request.uploader || metadata.channelTitle || 'Unknown',
    description: metadata.description,
    thumbnailUrl: metadata.thumbnail,
    channelTitle: metadata.channelTitle,
    metadata, // nếu Video entity có field metadata (jsonb)
  };
}
