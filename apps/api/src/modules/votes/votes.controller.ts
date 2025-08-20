import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { EntityType } from '../../shared/enums/entity-type.enum';
import { VoteType } from '../../shared/enums/vote-type.enum';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  @Get()
  findAll() {
    return this.votesService.findAll();
  }

  @Get('entity/:entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    return this.votesService.findByEntity(entityType, entityId);
  }

  @Get('entity/:entityType/:entityId/counts')
  getVoteCounts(
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    return this.votesService.getVoteCounts(entityType, entityId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.votesService.findByUser(userId);
  }

  @Get('user/:userId/entity/:entityType/:entityId')
  findUserVoteOnEntity(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    return this.votesService.findUserVoteOnEntity(userId, entityType, entityId);
  }

  @Post('user/:userId/entity/:entityType/:entityId/:voteType')
  changeVote(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseIntPipe) entityId: number,
    @Param('voteType') voteType: VoteType,
  ) {
    return this.votesService.changeVote(userId, entityType, entityId, voteType);
  }

  @Delete('user/:userId/entity/:entityType/:entityId')
  removeUserVote(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('entityType') entityType: EntityType,
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    return this.votesService.removeUserVote(userId, entityType, entityId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.votesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVoteDto: UpdateVoteDto,
  ) {
    return this.votesService.update(id, updateVoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.votesService.remove(id);
  }
}
