// apps/api/src/modules/tutorials/dto/update-tutorials.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { CreateTutorialDto } from './create-tutorials.dto';

export class UpdateTutorialDto extends PartialType(CreateTutorialDto) {
  // Do not allow changing author via update to prevent ownership tampering
  // author_id is intentionally omitted here
  @IsOptional()
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(1, { message: 'title cannot be empty' })
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(1, { message: 'content cannot be empty' })
  content?: string;
}
