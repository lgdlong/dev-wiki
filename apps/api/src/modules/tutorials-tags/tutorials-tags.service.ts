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

@Injectable()
export class TutorialTagsService {
  constructor(
    @InjectRepository(TutorialTag)
    private tutorialTagRepository: Repository<TutorialTag>,

    @InjectRepository(Tutorial)
    private readonly tutorialRepository: Repository<Tutorial>,

    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
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
}
