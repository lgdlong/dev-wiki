import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { EntityType } from '../../shared/enums/entity-type.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return await this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return await this.commentRepository.find({
      relations: ['author', 'parent', 'replies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'parent', 'replies'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findOne(id);
    await this.commentRepository.remove(comment);
  }

  async findByEntity(
    entityType: EntityType,
    entityId: number,
  ): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { entityType, entityId },
      relations: ['author', 'parent', 'replies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAuthor(authorId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { authorId },
      relations: ['author', 'parent', 'replies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReplies(parentId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { parentId },
      relations: ['author', 'replies'],
      order: { createdAt: 'ASC' },
    });
  }

  async incrementUpvotes(id: number): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.upvotes = (comment.upvotes || 0) + 1;
    return await this.commentRepository.save(comment);
  }

  async decrementUpvotes(id: number): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.upvotes = Math.max(0, (comment.upvotes || 0) - 1);
    return await this.commentRepository.save(comment);
  }
}
