import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TutorialTagsService } from './tutorials-tags.service';
import { CreateTutorialTagDto } from './dto/create-tutorials-tag.dto';
import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { UpsertTagsDto } from './dto/upsert-tags.dto';

@Controller('tutorial-tags')
export class TutorialTagsController {
  constructor(private readonly tutorialTagsService: TutorialTagsService) {}

  @Post('link')
  linkTutorialToTag(@Body() createTutorialTagDto: CreateTutorialTagDto) {
    return this.tutorialTagsService.linkTutorialToTag(createTutorialTagDto);
  }

  @Delete('unlink/:tutorialId/:tagId')
  unlinkTutorialFromTag(
    @Param('tutorialId', ParseIntPipe) tutorialId: number,
    @Param('tagId', ParseIntPipe) tagId: number,
  ) {
    return this.tutorialTagsService.unlinkTutorialFromTag(tutorialId, tagId);
  }

  @Get('tutorial/:tutorialId/tags')
  getTutorialTags(@Param('tutorialId', ParseIntPipe) tutorialId: number) {
    return this.tutorialTagsService.getTutorialTags(tutorialId);
  }

  @Get('tag/:tagId/tutorials')
  getTagTutorials(@Param('tagId', ParseIntPipe) tagId: number) {
    return this.tutorialTagsService.getTagTutorials(tagId);
  }

  @Get()
  findAll() {
    return this.tutorialTagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tutorialTagsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tutorialTagsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/tags')
  async upsertTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertTagsDto, // { tagIds: number[] }
  ) {
    // Trả về danh sách tag sau khi cập nhật cho tiện FE
    return this.tutorialTagsService.upsertTags(id, dto.tagIds);
  }

  @Get(':id/tags')
  async getTags(@Param('id', ParseIntPipe) id: number) {
    return this.tutorialTagsService.getTutorialTags(id);
  }


  
}
