import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorialTagsService } from '../tutorial-tags.service';
import { TutorialTag } from '../entities/tutorial-tag.entity';
import { CreateTutorialTagDto } from '../dto/create-tutorial-tag.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TutorialTagsService', () => {
  let service: TutorialTagsService;
  let repository: Repository<TutorialTag>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialTagsService,
        {
          provide: getRepositoryToken(TutorialTag),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TutorialTagsService>(TutorialTagsService);
    repository = module.get<Repository<TutorialTag>>(getRepositoryToken(TutorialTag));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('linkTutorialToTag', () => {
    it('should link tutorial to tag', async () => {
      const createDto: CreateTutorialTagDto = {
        tutorialId: 1,
        tagId: 2,
      };

      const savedLink = { id: 1, ...createDto };

      mockRepository.findOne.mockResolvedValue(null); // No existing link
      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockResolvedValue(savedLink);

      const result = await service.linkTutorialToTag(createDto);

      expect(result).toEqual(savedLink);
    });

    it('should throw ConflictException if link already exists', async () => {
      const createDto: CreateTutorialTagDto = {
        tutorialId: 1,
        tagId: 2,
      };

      const existingLink = { id: 1, tutorialId: 1, tagId: 2 };
      mockRepository.findOne.mockResolvedValue(existingLink);

      await expect(service.linkTutorialToTag(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('unlinkTutorialFromTag', () => {
    it('should unlink tutorial from tag', async () => {
      const link = { id: 1, tutorialId: 1, tagId: 2 };

      mockRepository.findOne.mockResolvedValue(link);
      mockRepository.remove.mockResolvedValue(link);

      await service.unlinkTutorialFromTag(1, 2);

      expect(mockRepository.remove).toHaveBeenCalledWith(link);
    });

    it('should throw NotFoundException if link not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.unlinkTutorialFromTag(1, 2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTutorialTags', () => {
    it('should return tags for a tutorial', async () => {
      const links = [
        { id: 1, tutorialId: 1, tagId: 2, tag: { id: 2, name: 'JavaScript' } },
        { id: 2, tutorialId: 1, tagId: 3, tag: { id: 3, name: 'React' } },
      ];

      mockRepository.find.mockResolvedValue(links);

      const result = await service.getTutorialTags(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tutorialId: 1 },
        relations: ['tag'],
      });
      expect(result).toEqual(links);
    });
  });

  describe('getTagTutorials', () => {
    it('should return tutorials for a tag', async () => {
      const links = [
        { id: 1, tutorialId: 1, tagId: 2, tutorial: { id: 1, title: 'Tutorial 1' } },
        { id: 2, tutorialId: 3, tagId: 2, tutorial: { id: 3, title: 'Tutorial 3' } },
      ];

      mockRepository.find.mockResolvedValue(links);

      const result = await service.getTagTutorials(2);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { tagId: 2 },
        relations: ['tutorial'],
      });
      expect(result).toEqual(links);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if link not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});