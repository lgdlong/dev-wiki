import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagSearchParams, TagSearchResult } from './interfaces';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    // Check if tag with same name already exists
    const existingTag = await this.tagRepository.findOne({
      where: { name: createTagDto.name },
    });

    if (existingTag) {
      throw new ConflictException(
        `Tag with name "${createTagDto.name}" already exists`,
      );
    }

    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  /**
   * Prefix search (tối ưu cho index text_pattern_ops):
   * WHERE name LIKE :prefix
   * ORDER BY name ASC
   * Keyset: name > :cursor
   */
  async search(params: TagSearchParams): Promise<TagSearchResult> {
    const term = (params.q ?? '').trim().toLowerCase();
    const take = Math.min(Math.max(Number(params.limit) || 10, 1), 50);
    const cursor = params.cursor ?? null;
    const minChars = params.minChars ?? 2;

    // Không query khi query quá ngắn để giảm tải
    if (term.length < minChars) {
      return { items: [], nextCursor: null };
    }

    const qb = this.tagRepository
      .createQueryBuilder('t')
      .select(['t.id', 't.name'])
      .where('t.name LIKE :prefix', { prefix: `${term}%` })
      .orderBy('t.name', 'ASC')
      .limit(take + 1); // lấy dư 1 để biết còn trang sau

    if (cursor) {
      qb.andWhere('t.name > :cursor', { cursor });
    }

    const rows = await qb.getMany();
    const hasMore = rows.length > take;
    const items = hasMore ? rows.slice(0, take) : rows;
    const nextCursor = hasMore ? items[items.length - 1].name : null;

    return { items, nextCursor };
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async findByName(name: string): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { name },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with name "${name}" not found`);
    }

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    // Check if updating name and new name already exists
    if (updateTagDto.name && updateTagDto.name !== tag.name) {
      const existingTag = await this.tagRepository.findOne({
        where: { name: updateTagDto.name },
      });

      if (existingTag) {
        throw new ConflictException(
          `Tag with name "${updateTagDto.name}" already exists`,
        );
      }
    }

    Object.assign(tag, updateTagDto);
    return await this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }
}
