import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsObject,
} from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsOptional()
  youtubeId?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsNumber()
  @IsOptional()
  uploaderId?: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
