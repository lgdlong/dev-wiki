// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

@Injectable()
export class TutorialService {
  constructor(@InjectRepository(Tutorial) private repo: Repository<Tutorial>) { }

  async create(dto: CreateTutorialDto) {
    try {
      const post = this.repo.create({
        title: dto.title.trim(),
        content: dto.content.trim(),
      // Define a local type for DTOs that may have author_id
      type CreateTutorialDtoWithAuthorId = CreateTutorialDto & { author_id?: number | string };
      const { author_id } = dto as CreateTutorialDtoWithAuthorId;
      const post = this.repo.create({
        title: dto.title.trim(),
        content: dto.content.trim(),
        authorId: author_id !== undefined ? Number(author_id) : undefined, // map snake -> camel
        views: 0,
      });
      return this.repo.save(post);
    } catch (e) {
      console.error('TutorialService.create error:', e);
      throw e;
    }
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Post #${id} not found`);
    return row;
  }

  async update(id: number, dto: UpdateTutorialDto) {
    const existing = await this.findOne(id);
    Object.assign(existing, dto);
    return this.repo.save(existing);
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    await this.repo.remove(existing);
    return { id };
  }
}
