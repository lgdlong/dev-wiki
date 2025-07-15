import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { EntityType } from 'src/common/enums/entity-type.enum';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @IsNumber()
  @IsNotEmpty()
  entityId: number;
}