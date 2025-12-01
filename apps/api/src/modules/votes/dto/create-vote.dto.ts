import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { EntityType } from '../../../shared/enums/entity-type.enum';
import { VoteType } from '../../../shared/enums/vote-type.enum';

export class CreateVoteDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  entityId: number;

  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @IsEnum(VoteType)
  @IsNotEmpty()
  voteType: VoteType;
}
