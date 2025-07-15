import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TutorialTagsService } from './tutorial-tags.service';
import { CreateTutorialTagDto } from './dto/create-tutorial-tag.dto';

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
}