import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EntityType } from 'src/common/enums/entity-type.enum';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get('entity/:entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    return this.commentsService.findByEntity(entityType, entityId);
  }

  @Get('author/:authorId')
  findByAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
    return this.commentsService.findByAuthor(authorId);
  }

  @Get('replies/:parentId')
  findReplies(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.commentsService.findReplies(parentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Patch(':id/upvote')
  incrementUpvotes(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.incrementUpvotes(id);
  }

  @Patch(':id/downvote')
  decrementUpvotes(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.decrementUpvotes(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}