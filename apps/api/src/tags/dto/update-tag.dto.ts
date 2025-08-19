import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';
import {
  IsLowercase,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsLowercase({ message: 'name must be lowercase' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'name must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/',
  })
  name?: string;
}
