import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  // Query,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { UpdateVideoDto } from './dto/update-video.dto';
import { RequestCreateVideo } from './interfaces/request-create-video.interface';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() reqCreateVideo: RequestCreateVideo) {
    return this.videosService.create(reqCreateVideo);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get('youtube/:youtubeId')
  findByYoutubeId(@Param('youtubeId') youtubeId: string) {
    return this.videosService.findByYoutubeId(youtubeId);
  }

  @Get('uploader/:uploader')
  findByUploader(@Param('uploader') uploader: string) {
    return this.videosService.findByUploader(uploader);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVideoDto: UpdateVideoDto,
  ) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videosService.remove(id);
  }
}
