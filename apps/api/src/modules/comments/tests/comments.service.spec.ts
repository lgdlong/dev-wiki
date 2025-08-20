import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsService } from '../comments.service';
import { Comment } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { EntityType } from '../../../shared/enums/entity-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: Repository<Comment>;

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
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        content: 'Test comment',
        authorId: 1,
        entityType: EntityType.TUTORIAL,
        entityId: 1,
      };

      const savedComment = { id: 1, ...createCommentDto };

      mockRepository.create.mockReturnValue(createCommentDto);
      mockRepository.save.mockResolvedValue(savedComment);

      const result = await service.create(createCommentDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createCommentDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createCommentDto);
      expect(result).toEqual(savedComment);
    });
  });

  describe('findByEntity', () => {
    it('should return comments for a specific entity', async () => {
      const comments = [
        {
          id: 1,
          content: 'Comment 1',
          entityType: EntityType.TUTORIAL,
          entityId: 1,
        },
        {
          id: 2,
          content: 'Comment 2',
          entityType: EntityType.TUTORIAL,
          entityId: 1,
        },
      ];

      mockRepository.find.mockResolvedValue(comments);

      const result = await service.findByEntity(EntityType.TUTORIAL, 1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { entityType: EntityType.TUTORIAL, entityId: 1 },
        relations: ['author', 'parent', 'replies'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(comments);
    });
  });

  describe('incrementUpvotes', () => {
    it('should increment upvotes count', async () => {
      const comment = { id: 1, content: 'Test', upvotes: 5 };
      const updatedComment = { ...comment, upvotes: 6 };

      mockRepository.findOne.mockResolvedValue(comment);
      mockRepository.save.mockResolvedValue(updatedComment);

      const result = await service.incrementUpvotes(1);

      expect(result.upvotes).toBe(6);
    });

    it('should handle null upvotes', async () => {
      const comment = { id: 1, content: 'Test', upvotes: null };
      const updatedComment = { ...comment, upvotes: 1 };

      mockRepository.findOne.mockResolvedValue(comment);
      mockRepository.save.mockResolvedValue(updatedComment);

      const result = await service.incrementUpvotes(1);

      expect(result.upvotes).toBe(1);
    });
  });

  describe('decrementUpvotes', () => {
    it('should decrement upvotes count', async () => {
      const comment = { id: 1, content: 'Test', upvotes: 5 };
      const updatedComment = { ...comment, upvotes: 4 };

      mockRepository.findOne.mockResolvedValue(comment);
      mockRepository.save.mockResolvedValue(updatedComment);

      const result = await service.decrementUpvotes(1);

      expect(result.upvotes).toBe(4);
    });

    it('should not go below 0', async () => {
      const comment = { id: 1, content: 'Test', upvotes: 0 };
      const updatedComment = { ...comment, upvotes: 0 };

      mockRepository.findOne.mockResolvedValue(comment);
      mockRepository.save.mockResolvedValue(updatedComment);

      const result = await service.decrementUpvotes(1);

      expect(result.upvotes).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if comment not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
