import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNumber()
  @IsOptional()
  upvotes?: number;
}
