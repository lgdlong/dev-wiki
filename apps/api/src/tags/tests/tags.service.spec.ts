import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagsService } from '../tags.service';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from '../dto/create-tag.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  let repository: Repository<Tag>;

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
        TagsService,
        {
          provide: getRepositoryToken(Tag),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    repository = module.get<Repository<Tag>>(getRepositoryToken(Tag));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const createTagDto: CreateTagDto = {
        name: 'JavaScript',
        description: 'Programming language',
      };

      const savedTag = { id: 1, ...createTagDto };

      mockRepository.findOne.mockResolvedValue(null); // No existing tag
      mockRepository.create.mockReturnValue(createTagDto);
      mockRepository.save.mockResolvedValue(savedTag);

      const result = await service.create(createTagDto);

      expect(result).toEqual(savedTag);
    });

    it('should throw ConflictException if tag name already exists', async () => {
      const createTagDto: CreateTagDto = {
        name: 'JavaScript',
        description: 'Programming language',
      };

      const existingTag = { id: 1, name: 'JavaScript' };
      mockRepository.findOne.mockResolvedValue(existingTag);

      await expect(service.create(createTagDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByName', () => {
    it('should return tag by name', async () => {
      const tag = { id: 1, name: 'JavaScript', description: 'Programming language' };

      mockRepository.findOne.mockResolvedValue(tag);

      const result = await service.findByName('JavaScript');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'JavaScript' },
      });
      expect(result).toEqual(tag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByName('NonExistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update tag', async () => {
      const tag = { id: 1, name: 'JavaScript', description: 'Old description' };
      const updateTagDto = { description: 'New description' };
      const updatedTag = { ...tag, ...updateTagDto };

      mockRepository.findOne.mockResolvedValue(tag);
      mockRepository.save.mockResolvedValue(updatedTag);

      const result = await service.update(1, updateTagDto);

      expect(result).toEqual(updatedTag);
    });

    it('should throw ConflictException when updating to existing name', async () => {
      const tag = { id: 1, name: 'JavaScript', description: 'Description' };
      const updateTagDto = { name: 'Python' };
      const existingTag = { id: 2, name: 'Python' };

      mockRepository.findOne
        .mockResolvedValueOnce(tag) // findOne for the tag being updated
        .mockResolvedValueOnce(existingTag); // findOne for existing tag with new name

      await expect(service.update(1, updateTagDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if tag not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});