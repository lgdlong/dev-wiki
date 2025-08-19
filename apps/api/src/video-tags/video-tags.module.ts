// src/video-tags/video-tags.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoTag } from './entities/video-tag.entity';
import { Video } from '../videos/entities/video.entity';
import { Tag } from '../tags/entities/tag.entity';
import { VideoTagsService } from './video-tags.service';
import { VideoTagsController } from './video-tags.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VideoTag, Video, Tag])],
  controllers: [VideoTagsController],
  providers: [VideoTagsService],
  exports: [VideoTagsService],
})
export class VideoTagsModule {}
