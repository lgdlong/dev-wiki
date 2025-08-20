// src/video-tags/dto/upsert-video-tags.dto.ts
import {
  IsInt,
  Min,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class UpsertVideoTagsDto {
  @IsInt() @Min(1) videoId!: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tagIds!: number[];
}
