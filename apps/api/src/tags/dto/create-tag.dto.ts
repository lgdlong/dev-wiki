import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsLowercase,
  Matches,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsLowercase({ message: 'name must be lowercase' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'name must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/ (lowercase letters, digits, single hyphens between parts)',
  })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
