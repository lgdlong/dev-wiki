import { IsArray, ArrayNotEmpty, IsInt, ArrayUnique, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertTagsDto {
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayUnique()
  // Nếu muốn bắt buộc ít nhất 1 tag thì thêm @ArrayNotEmpty()
  tagIds: number[];
}
