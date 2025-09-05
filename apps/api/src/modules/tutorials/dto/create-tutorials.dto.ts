// apps/api/src/modules/tutorials/dto/create-tutorials.dto.ts
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTutorialDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  // nếu dùng JWT để lấy author_id từ token thì field này không cần trong body
}
