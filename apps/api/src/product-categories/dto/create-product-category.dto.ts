import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductCategoryDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
