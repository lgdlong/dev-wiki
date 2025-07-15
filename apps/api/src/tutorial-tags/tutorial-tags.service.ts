import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorialTag } from './entities/tutorial-tag.entity';
import { CreateTutorialTagDto } from './dto/create-tutorial-tag.dto';

@Injectable()
export class TutorialTagsService {
  constructor(
    @InjectRepository(TutorialTag)
    private tutorialTagRepository: Repository<TutorialTag>,
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

  async getTutorialTags(tutorialId: number): Promise<TutorialTag[]> {
    return await this.tutorialTagRepository.find({
      where: { tutorialId },
      relations: ['tag'],
    });
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
}
