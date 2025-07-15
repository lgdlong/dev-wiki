import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { EntityType } from 'src/common/enums/entity-type.enum';
import { VoteType } from 'src/common/enums/vote-type.enum';

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