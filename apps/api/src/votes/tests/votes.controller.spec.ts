import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from '../votes.controller';
import { VotesService } from '../votes.service';
import { EntityType } from 'src/common/enums/entity-type.enum';
import { VoteType } from 'src/common/enums/vote-type.enum';

describe('VotesController', () => {
  let controller: VotesController;
  let service: VotesService;

  const mockVotesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByEntity: jest.fn(),
    findByUser: jest.fn(),
    findUserVoteOnEntity: jest.fn(),
    getVoteCounts: jest.fn(),
    changeVote: jest.fn(),
    removeUserVote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [
        {
          provide: VotesService,
          useValue: mockVotesService,
        },
      ],
    }).compile();

    controller = module.get<VotesController>(VotesController);
    service = module.get<VotesService>(VotesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getVoteCounts', () => {
    it('should return vote counts for entity', async () => {
      const result = { upvotes: 5, downvotes: 2 };
      mockVotesService.getVoteCounts.mockResolvedValue(result);

      expect(await controller.getVoteCounts(EntityType.TUTORIAL, 1)).toBe(
        result,
      );
      expect(service.getVoteCounts).toHaveBeenCalledWith(
        EntityType.TUTORIAL,
        1,
      );
    });
  });

  describe('changeVote', () => {
    it('should change user vote', async () => {
      const result = {
        id: 1,
        userId: 1,
        entityType: EntityType.TUTORIAL,
        entityId: 1,
        voteType: VoteType.UP,
      };
      mockVotesService.changeVote.mockResolvedValue(result);

      expect(
        await controller.changeVote(1, EntityType.TUTORIAL, 1, VoteType.UP),
      ).toBe(result);
      expect(service.changeVote).toHaveBeenCalledWith(
        1,
        EntityType.TUTORIAL,
        1,
        VoteType.UP,
      );
    });
  });

  describe('removeUserVote', () => {
    it('should remove user vote', async () => {
      mockVotesService.removeUserVote.mockResolvedValue(undefined);

      await controller.removeUserVote(1, EntityType.TUTORIAL, 1);
      expect(service.removeUserVote).toHaveBeenCalledWith(
        1,
        EntityType.TUTORIAL,
        1,
      );
    });
  });
});
