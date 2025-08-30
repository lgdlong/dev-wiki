import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class UpsertTagsDto {
  @IsArray()
  @IsInt({ each: true })
  // Nếu muốn bắt buộc ít nhất 1 tag thì thêm @ArrayNotEmpty()
  tagIds: number[];
}
