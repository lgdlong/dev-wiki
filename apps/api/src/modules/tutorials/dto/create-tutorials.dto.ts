import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class CreateTutorialDto {
  @IsString()
  @IsNotEmpty()
  @Length(1,100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  // nếu dùng JWT để lấy author_id từ token thì field này không cần trong body
  // ahthour_id đã bị xóa
}


