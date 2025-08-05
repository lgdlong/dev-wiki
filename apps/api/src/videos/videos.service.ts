import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import { Video } from './entities/video.entity';
import { UpdateVideoDto } from './dto/update-video.dto';
import { RequestCreateVideo } from './interfaces/request-create-video.interface';
import { YoutubeMetadata } from './interfaces/youtube-metadata.interface';
import { toVideoEntity } from 'src/mappers/video.mapper';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  private YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

  // Tạo video, tự động lấy metadata từ Youtube
  async create(requestCreateVideo: RequestCreateVideo): Promise<Video> {
    // Lấy metadata từ Youtube
    const metadata: YoutubeMetadata | undefined = await this.getYoutubeMetadata(
      requestCreateVideo.youtubeId,
    );
    if (!metadata) {
      throw new HttpException('Cannot fetch video metadata', 400);
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

  async findByUploader(uploader: string): Promise<Video[]> {
    return await this.videoRepository.find({
      where: { uploader },
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
        part: ['snippet'],
      });

      const item = res.data.items?.[0];
      if (!item) return {};

      return {
        title: item.snippet?.title ?? undefined,
        // full descriptions, its can be long
        description: item.snippet?.description ?? undefined,
        // thumbnail picture url, size medium
        thumbnail: item.snippet?.thumbnails?.medium?.url ?? '',
        // the channel uploaded this video on YouTube
        channelTitle: item.snippet?.channelTitle ?? undefined,
        // the number of this video's views
        viewCount: item.statistics?.viewCount ?? undefined,
      };
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error);
      throw new HttpException('Failed to fetch YouTube metadata', 500);
    }
  }
}
