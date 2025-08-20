import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VotesService } from '../votes.service';
import { Vote } from '../entities/vote.entity';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { EntityType } from '../../../shared/enums/entity-type.enum';
import { VoteType } from '../../../shared/enums/vote-type.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('VotesService', () => {
  let service: VotesService;
  let repository: Repository<Vote>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: getRepositoryToken(Vote),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
    repository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a vote', async () => {
      const createVoteDto: CreateVoteDto = {
        userId: 1,
        entityType: EntityType.TUTORIAL,
        entityId: 1,
        voteType: VoteType.UP,
      };

      const savedVote = { id: 1, ...createVoteDto };

      mockRepository.findOne.mockResolvedValue(null); // No existing vote
      mockRepository.create.mockReturnValue(createVoteDto);
      mockRepository.save.mockResolvedValue(savedVote);

      const result = await service.create(createVoteDto);

      expect(result).toEqual(savedVote);
    });

    it('should throw ConflictException if user already voted', async () => {
      const createVoteDto: CreateVoteDto = {
        userId: 1,
        entityType: EntityType.TUTORIAL,
        entityId: 1,
        voteType: VoteType.UP,
      };

      const existingVote = { id: 1, ...createVoteDto };
      mockRepository.findOne.mockResolvedValue(existingVote);

      await expect(service.create(createVoteDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getVoteCounts', () => {
    it('should return vote counts for an entity', async () => {
      mockRepository.count
        .mockResolvedValueOnce(5) // upvotes
        .mockResolvedValueOnce(2); // downvotes

      const result = await service.getVoteCounts(EntityType.TUTORIAL, 1);

      expect(result).toEqual({ upvotes: 5, downvotes: 2 });
      expect(mockRepository.count).toHaveBeenCalledTimes(2);
    });
  });

  describe('changeVote', () => {
    it('should update existing vote', async () => {
      const existingVote = {
        id: 1,
        userId: 1,
        entityType: EntityType.TUTORIAL,
        entityId: 1,
        voteType: VoteType.UP,
      };

      const updatedVote = { ...existingVote, voteType: VoteType.DOWN };

      mockRepository.findOne.mockResolvedValue(existingVote);
      mockRepository.save.mockResolvedValue(updatedVote);

      const result = await service.changeVote(
        1,
        EntityType.TUTORIAL,
        1,
        VoteType.DOWN,
      );

      expect(result.voteType).toBe(VoteType.DOWN);
    });

    it('should create new vote if none exists', async () => {
      const newVoteDto = {
        userId: 1,
        entityType: EntityType.TUTORIAL,
        entityId: 1,
        voteType: VoteType.UP,
      };

      mockRepository.findOne
        .mockResolvedValueOnce(null) // findUserVoteOnEntity
        .mockResolvedValueOnce(null); // create check
      mockRepository.create.mockReturnValue(newVoteDto);
      mockRepository.save.mockResolvedValue({ id: 1, ...newVoteDto });

      const result = await service.changeVote(
        1,
        EntityType.TUTORIAL,
        1,
        VoteType.UP,
      );

      expect(result.voteType).toBe(VoteType.UP);
    });
  });

  describe('findUserVoteOnEntity', () => {
    it('should return user vote on entity', async () => {
      const vote = {
        id: 1,
        userId: 1,
        entityType: EntityType.TUTORIAL,
        entityId: 1,
        voteType: VoteType.UP,
      };

      mockRepository.findOne.mockResolvedValue(vote);

      const result = await service.findUserVoteOnEntity(
        1,
        EntityType.TUTORIAL,
        1,
      );

      expect(result).toEqual(vote);
    });

    it('should return null if no vote found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findUserVoteOnEntity(
        1,
        EntityType.TUTORIAL,
        1,
      );

      expect(result).toBeNull();
    });
  });
});
