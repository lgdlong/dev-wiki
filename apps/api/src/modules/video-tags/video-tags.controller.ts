// src/video-tags/video-tags.controller.ts
import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { VideoTagsService } from './video-tags.service';
import { CreateVideoTagDto } from './dto/create-video-tag.dto';
import { UpsertVideoTagsDto } from './dto/upsert-video-tag.dto';
import { Tag } from '../tags/entities/tag.entity';
import { AuthenticatedRequest } from '../../shared/types/authenticated-request.interface';


@Controller()
@UseGuards(JwtAuthGuard)
export class VideoTagsController {
  constructor(private readonly service: VideoTagsService) {}

  // Gắn 1 tag vào 1 video
  @Post('video-tags')
  attachOne(
    @Body() dto: CreateVideoTagDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user.id);
    return this.service.attachOne(dto, userId);
  }

  // Bỏ 1 tag khỏi 1 video
  @Delete('video-tags/:videoId/:tagId')
  detachOne(
    @Param('videoId', ParseIntPipe) videoId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    return this.service.detachOne(videoId, tagId);
  }

  // Thay toàn bộ tag của video
  @Patch('videos/:id/tags')
  upsertForVideo(
    @Param('id', ParseIntPipe) videoId: number,
    @Body() body: Pick<UpsertVideoTagsDto, 'tagIds'>,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = Number(req.user?.id);
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return this.service.upsertForVideo(
      { videoId, tagIds: body.tagIds },
      userId,
    );
  }

  // Lấy tag của 1 video
  @Get('videos/:id/tags')
  findTagsByVideo(@Param('id', ParseIntPipe) videoId: number): Promise<Tag[]> {
    return this.service.findTagsByVideo(videoId);
  }

  // Lấy video theo 1 tag
  @Get('tags/:id/videos')
  findVideosByTag(@Param('id', ParseIntPipe) tagId: number) {
    return this.service.findVideosByTag(tagId);
  }
}
