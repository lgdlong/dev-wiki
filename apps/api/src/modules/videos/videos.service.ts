import {
  HttpException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import { VideoTagsService } from '../video-tags/video-tags.service';
import { Video } from './entities/video.entity';
import { UpdateVideoDto } from './dto/update-video.dto';
import { RequestCreateVideo } from './interfaces/request-create-video.interface';
import { YoutubeMetadata } from './interfaces/youtube-metadata.interface';
import { toVideoEntity } from './mappers/video.mapper';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @Inject(forwardRef(() => VideoTagsService))
    private videoTagsService: VideoTagsService,
  ) {}

  private YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

  /**
   * Lấy danh sách video theo tên tag (không dùng relation, dùng module video-tags)
   */
  async findByTagName(tagName: string): Promise<Video[]> {
    // 1. Lấy tag theo tên
    // 2. Lấy videoId từ videoTagsService
    // 3. Truy vấn video theo id
    const tag = await this.videoTagsService['tagRepo'].findOne({
      where: { name: tagName },
    });
    if (!tag) return [];
    const videoTags = await this.videoTagsService['videoTagRepo'].find({
      where: { tag: { id: tag.id } },
      relations: ['video'],
    });
    const videos = videoTags.map((vt) => vt.video).filter(Boolean);
    // Sắp xếp theo createdAt DESC
    return videos.sort((a, b) => (b.createdAt as any) - (a.createdAt as any));
  }

  async findByTag(tagId: number): Promise<Video[]> {
    // Không dùng relation, dùng module video-tags
    const videoTags = await this.videoTagsService['videoTagRepo'].find({
      where: { tag: { id: tagId } },
      relations: ['video'],
    });
    const videos = videoTags.map((vt) => vt.video).filter(Boolean);
    return videos.sort((a, b) => (b.createdAt as any) - (a.createdAt as any));
  }

  // Tạo videos, tự động lấy metadata từ Youtube
  async create(requestCreateVideo: RequestCreateVideo): Promise<Video> {
    // Check for duplicate YouTube ID
    const existing = await this.videoRepository.findOne({
      where: { youtubeId: requestCreateVideo.youtubeId },
    });
    if (existing) {
      throw new HttpException(
        `Video with YouTube ID "${requestCreateVideo.youtubeId}" already exists`,
        409,
      );
    }

    // Lấy metadata từ Youtube
    const metadata: YoutubeMetadata | undefined = await this.getYoutubeMetadata(
      requestCreateVideo.youtubeId,
    );
    if (!metadata) {
      throw new HttpException('Cannot fetch videos metadata', 400);
    }

    // Mapping qua hàm mapper
    const videoEntity: Partial<Video> = toVideoEntity(
      requestCreateVideo,
      metadata,
    );

    // Khởi tạo entity bằng repository
    const video: Video = this.videoRepository.create(videoEntity);

    return await this.videoRepository.save(video);
  }

  async findAll(): Promise<Video[]> {
    return await this.videoRepository.find();
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { id },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findOne(id);
    Object.assign(video, updateVideoDto);
    return await this.videoRepository.save(video);
  }

  async remove(id: number): Promise<void> {
    const video = await this.findOne(id);
    await this.videoRepository.remove(video);
  }

  async findByUploaderId(uploaderId: number): Promise<Video[]> {
    return await this.videoRepository.find({
      where: { uploaderId },
    });
  }

  async findByYoutubeId(youtubeId: string): Promise<Video> {
    const video = await this.videoRepository.findOne({
      where: { youtubeId },
    });

    if (!video) {
      throw new NotFoundException(
        `Video with YouTube ID ${youtubeId} not found`,
      );
    }

    return video;
  }

  private async getYoutubeMetadata(
    youtubeId: string,
  ): Promise<YoutubeMetadata> {
    try {
      const youtube = google.youtube({
        version: 'v3',
        auth: this.YOUTUBE_API_KEY,
      });
      const res = await youtube.videos.list({
        id: [youtubeId],
        part: ['snippet', 'contentDetails'],
      });

      const item = res.data.items?.[0];
      if (!item) throw new HttpException('Video not found on YouTube', 404);

      const durationISO = item.contentDetails?.duration;
      if (!durationISO)
        throw new HttpException('Missing YouTube duration', 502);

      const durationSeconds = this.parseDuration(durationISO);

      return {
        title: item.snippet?.title || 'No Title',
        description: item.snippet?.description || 'No description',
        thumbnail: item.snippet?.thumbnails?.medium?.url ?? 'No thumbnail',
        duration: durationSeconds,
        channelTitle: item.snippet?.channelTitle || 'No Channel Title',
      };
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error);
      throw new HttpException('Failed to fetch metadata', 500);
    }
  }

  /**
   * Parses an ISO 8601 duration string (e.g., "PT1H2M3S") and converts it to the total number of seconds.
   *
   * @param durationISO - The duration string to parse, typically in the format "PT#H#M#S".
   * @returns The total duration in seconds.
   * @example Parses "PT1H2M3S" and returns 3723 seconds
   */
  private parseDuration(durationISO: string): number {
    const matches = durationISO.match(/[0-9]+[HMS]/g);
    let seconds = 0;
    (matches || []).forEach((part) => {
      const unit = part.charAt(part.length - 1);
      const amount = parseInt(part.slice(0, -1), 10);
      if (unit === 'H') seconds += amount * 3600;
      else if (unit === 'M') seconds += amount * 60;
      else if (unit === 'S') seconds += amount;
    });
    return seconds;
  }
}
