import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateTutorialDto {
  // Do not allow changing author via update to prevent ownership tampering
  // author_id is intentionally omitted here
  @IsNotEmpty()
  @MinLength(1)
  id: number;

  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @IsNotEmpty()
  @MinLength(1)
  content: string;

  @IsNotEmpty()
  @MinLength(1)
  authorName: string;

}
