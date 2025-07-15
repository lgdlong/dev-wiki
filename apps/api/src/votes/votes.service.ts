import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { EntityType } from 'src/common/enums/entity-type.enum';
import { VoteType } from 'src/common/enums/vote-type.enum';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepository: Repository<Vote>,
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    // Check if user has already voted on this entity
    const existingVote = await this.voteRepository.findOne({
      where: {
        userId: createVoteDto.userId,
        entityType: createVoteDto.entityType,
        entityId: createVoteDto.entityId,
      },
    });

    if (existingVote) {
      throw new ConflictException('User has already voted on this entity');
    }

    const vote = this.voteRepository.create(createVoteDto);
    return await this.voteRepository.save(vote);
  }

  async findAll(): Promise<Vote[]> {
    return await this.voteRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Vote> {
    const vote = await this.voteRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!vote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }
    
    return vote;
  }

  async update(id: number, updateVoteDto: UpdateVoteDto): Promise<Vote> {
    const vote = await this.findOne(id);
    Object.assign(vote, updateVoteDto);
    return await this.voteRepository.save(vote);
  }

  async remove(id: number): Promise<void> {
    const vote = await this.findOne(id);
    await this.voteRepository.remove(vote);
  }

  async findByEntity(entityType: EntityType, entityId: number): Promise<Vote[]> {
    return await this.voteRepository.find({
      where: { entityType, entityId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Vote[]> {
    return await this.voteRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findUserVoteOnEntity(userId: number, entityType: EntityType, entityId: number): Promise<Vote | null> {
    return await this.voteRepository.findOne({
      where: { userId, entityType, entityId },
      relations: ['user'],
    });
  }

  async getVoteCounts(entityType: EntityType, entityId: number): Promise<{ upvotes: number; downvotes: number }> {
    const upvotes = await this.voteRepository.count({
      where: { entityType, entityId, voteType: VoteType.UP },
    });

    const downvotes = await this.voteRepository.count({
      where: { entityType, entityId, voteType: VoteType.DOWN },
    });

    return { upvotes, downvotes };
  }

  async changeVote(userId: number, entityType: EntityType, entityId: number, newVoteType: VoteType): Promise<Vote> {
    const existingVote = await this.findUserVoteOnEntity(userId, entityType, entityId);
    
    if (existingVote) {
      existingVote.voteType = newVoteType;
      return await this.voteRepository.save(existingVote);
    } else {
      return await this.create({ userId, entityType, entityId, voteType: newVoteType });
    }
  }

  async removeUserVote(userId: number, entityType: EntityType, entityId: number): Promise<void> {
    const vote = await this.findUserVoteOnEntity(userId, entityType, entityId);
    if (vote) {
      await this.voteRepository.remove(vote);
    }
  }
}