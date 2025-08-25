import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTutorialTagDto {
  @IsNumber()
  @IsNotEmpty()
  tutorialId: number;

  @IsNumber()
  @IsNotEmpty()
  tagId: number;
}
