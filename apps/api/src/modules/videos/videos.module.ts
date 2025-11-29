import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { Video } from './entities/video.entity';
import { VideoTagsModule } from '../video-tags/video-tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), VideoTagsModule],
  controllers: [VideosController],
  providers: [VideosService],
  exports: [VideosService],
})
export class VideosModule {}
