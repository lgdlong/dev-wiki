import { IsInt, Min } from 'class-validator';

export class CreateVideoTagDto {
  @IsInt() @Min(1) videoId!: number;
  @IsInt() @Min(1) tagId!: number;
  // có thể inject userId từ auth guard thay vì nhận qua body
}
