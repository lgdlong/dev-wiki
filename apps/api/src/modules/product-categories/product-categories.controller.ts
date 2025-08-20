import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post('link')
  linkProductToCategory(
    @Body() createProductCategoryDto: CreateProductCategoryDto,
  ) {
    return this.productCategoriesService.linkProductToCategory(
      createProductCategoryDto,
    );
  }

  @Delete('unlink/:productId/:categoryId')
  unlinkProductFromCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productCategoriesService.unlinkProductFromCategory(
      productId,
      categoryId,
    );
  }

  @Get('product/:productId/categories')
  getProductCategories(@Param('productId', ParseIntPipe) productId: number) {
    return this.productCategoriesService.getProductCategories(productId);
  }

  @Get('category/:categoryId/products')
  getCategoryProducts(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productCategoriesService.getCategoryProducts(categoryId);
  }

  @Get()
  findAll() {
    return this.productCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.remove(id);
  }
}
