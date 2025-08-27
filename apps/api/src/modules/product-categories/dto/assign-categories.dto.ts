import { IsNumber, IsArray, ArrayMinSize, ArrayUnique } from 'class-validator';
import { Type } from 'class-transformer';

export class AssignCategoriesDto {
  @IsNumber()
  productId: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one category ID must be provided' })
  @ArrayUnique({ message: 'Category IDs must be unique' })
  @Type(() => Number)
  @IsNumber({}, { each: true, message: 'Each category ID must be a number' })
  categoryIds: number[];
}

export class AssignCategoriesResponseDto {
  assigned: number; // số category mới được gắn
  skipped: number; // số category đã gắn trước đó (skip)
  total: number; // tổng số category hiện gắn
  newlyAssigned: number[]; // danh sách id mới gắn
  alreadyAssigned: number[]; // danh sách id đã có
}
