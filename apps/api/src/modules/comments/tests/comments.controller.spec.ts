import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from '../comments.controller';
import { CommentsService } from '../comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { EntityType } from '../../../shared/enums/entity-type.enum';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockCommentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByEntity: jest.fn(),
    findByAuthor: jest.fn(),
    findReplies: jest.fn(),
    incrementUpvotes: jest.fn(),
    decrementUpvotes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByEntity', () => {
    it('should return comments for entity', async () => {
      const result = [
        {
          id: 1,
          content: 'Comment 1',
          entityType: EntityType.TUTORIAL,
          entityId: 1,
        },
      ];
      mockCommentsService.findByEntity.mockResolvedValue(result);

      expect(await controller.findByEntity(EntityType.TUTORIAL, 1)).toBe(
        result,
      );
      expect(service.findByEntity).toHaveBeenCalledWith(EntityType.TUTORIAL, 1);
    });
  });

  describe('incrementUpvotes', () => {
    it('should increment comment upvotes', async () => {
      const result = { id: 1, content: 'Comment', upvotes: 6 };
      mockCommentsService.incrementUpvotes.mockResolvedValue(result);

      expect(await controller.incrementUpvotes(1)).toBe(result);
      expect(service.incrementUpvotes).toHaveBeenCalledWith(1);
    });
  });

  describe('decrementUpvotes', () => {
    it('should decrement comment upvotes', async () => {
      const result = { id: 1, content: 'Comment', upvotes: 4 };
      mockCommentsService.decrementUpvotes.mockResolvedValue(result);

      expect(await controller.decrementUpvotes(1)).toBe(result);
      expect(service.decrementUpvotes).toHaveBeenCalledWith(1);
    });
  });
});
