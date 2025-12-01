import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { TutorialTag } from './entities/tutorials-tag.entity';
import { CreateTutorialTagDto } from './dto/create-tutorials-tag.dto';
import { Tutorial } from '../tutorials/entities/tutorials.entity';
import { Tag } from '../tags/entities/tag.entity';
import { TutorialListItemDto } from '../tutorials/dto/tutorials.dto';
import { Account } from '../account/entities/account.entity';
import {
  DEFAULT_AUTHOR_NAME,
  DEFAULT_AVATAR_URL,
} from '../../shared/constants';

@Injectable()
export class TutorialTagsService {
  constructor(
    @InjectRepository(TutorialTag)
    private tutorialTagRepository: Repository<TutorialTag>,

    @InjectRepository(Tutorial)
    private readonly tutorialRepository: Repository<Tutorial>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  async linkTutorialToTag(
    createTutorialTagDto: CreateTutorialTagDto,
  ): Promise<TutorialTag> {
    // Check if link already exists
    const existingLink = await this.tutorialTagRepository.findOne({
      where: {
        tutorialId: createTutorialTagDto.tutorialId,
        tagId: createTutorialTagDto.tagId,
      },
    });

    if (existingLink) {
      throw new ConflictException('Tutorial is already linked to this tag');
    }

    const tutorialTag = this.tutorialTagRepository.create(createTutorialTagDto);
    return await this.tutorialTagRepository.save(tutorialTag);
  }

  async unlinkTutorialFromTag(
    tutorialId: number,
    tagId: number,
  ): Promise<void> {
    const link = await this.tutorialTagRepository.findOne({
      where: { tutorialId, tagId },
    });

    if (!link) {
      throw new NotFoundException('Tutorial-tag link not found');
    }

    await this.tutorialTagRepository.remove(link);
  }

  async getTutorialTags(tutorialId: number): Promise<Tag[]> {
    const tutorialTags = await this.tutorialTagRepository.find({
      where: { tutorialId },
      relations: ['tag'],
    });
    return tutorialTags.map((tt) => tt.tag);
  }

  async getTagTutorials(tagId: number): Promise<TutorialTag[]> {
    return await this.tutorialTagRepository.find({
      where: { tagId },
      relations: ['tutorial'],
    });
  }

  async findAll(): Promise<TutorialTag[]> {
    return await this.tutorialTagRepository.find({
      relations: ['tutorial', 'tag'],
    });
  }

  async findOne(id: number): Promise<TutorialTag> {
    const tutorialTag = await this.tutorialTagRepository.findOne({
      where: { id },
      relations: ['tutorial', 'tag'],
    });

    if (!tutorialTag) {
      throw new NotFoundException(`Tutorial-tag link with ID ${id} not found`);
    }

    return tutorialTag;
  }

  async remove(id: number): Promise<void> {
    const tutorialTag = await this.findOne(id);
    await this.tutorialTagRepository.remove(tutorialTag);
  }

  async upsertTags(tutorialId: number, tagIds: number[]) {
    // 1) validate tutorial tồn tại
    const tutorial = await this.tutorialRepository.findOne({
      where: { id: tutorialId },
    });
    if (!tutorial) throw new NotFoundException('Tutorial not found');

    // 2) validate tagIds tồn tại
    const tags = await this.tagRepository.findBy({ id: In(tagIds || []) });
    if ((tagIds?.length || 0) !== tags.length) {
      throw new BadRequestException('Some tagIds are invalid');
    }

    // 3) replace toàn bộ links (transaction để an toàn)
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(TutorialTag, { tutorialId });
      if (tags.length > 0) {
        const rows = tags.map((t) =>
          manager.create(TutorialTag, { tutorialId, tagId: t.id }),
        );
        await manager.save(rows);
      }
    });

    // 4) trả về tags mới
    return tags;
  }

  async getTutorialsByTagName(tagName: string): Promise<TutorialListItemDto[]> {
    // 1. Find tag by name
    const tag = await this.tagRepository.findOne({ where: { name: tagName } });
    if (!tag) return [];
    // 2. Find all tutorial-tag links for this tag
    const tutorialTags = await this.tutorialTagRepository.find({
      where: { tagId: tag.id },
      relations: ['tutorial'],
    });
    // 3. Map tutorials to DTO with author info
    const tutorials = tutorialTags.map((tt) => tt.tutorial).filter(Boolean);

    // 4. Fetch author details and map to DTO
    const dtos = await Promise.all(
      tutorials.map(async (tutorial) => {
        let authorName = DEFAULT_AUTHOR_NAME;
        let authorAvatarUrl = DEFAULT_AVATAR_URL;

        if (tutorial.authorId) {
          const author = await this.accountRepository.findOne({
            where: { id: tutorial.authorId },
            select: ['name', 'avatar_url'],
          });
          if (author) {
            authorName = author.name;
            authorAvatarUrl = author.avatar_url || DEFAULT_AVATAR_URL;
          }
        }

        return new TutorialListItemDto({
          id: tutorial.id,
          title: tutorial.title,
          slug: tutorial.slug,
          createdAt: tutorial.createdAt,
          updatedAt: tutorial.updatedAt,
          authorName,
          authorAvatarUrl,
        });
      }),
    );

    return dtos;
  }
}
