import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import {
  AssignCategoriesDto,
  AssignCategoriesResponseDto,
} from './dto/assign-categories.dto';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { AccountRole } from '../../shared/enums/account-role.enum';

@Controller('product-categories')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  // ========= Public (no auth) =========

  @Get()
  findAll() {
    return this.productCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.findOne(id);
  }

  @Get('product/:productId/categories')
  getProductCategories(@Param('productId', ParseIntPipe) productId: number) {
    return this.productCategoriesService.getProductCategories(productId);
  }

  @Get('category/:categoryId/products')
  getCategoryProducts(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productCategoriesService.getCategoryProducts(categoryId);
  }

  // ========= Protected (JWT + Role) =========

  // Bulk assign (idempotent, transactional)
  @Put('assign-multiple')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountRole.MOD)
  async assignCategoriesToProduct(
    @Body() dto: AssignCategoriesDto,
  ): Promise<AssignCategoriesResponseDto> {
    return this.productCategoriesService.assignCategoriesToProduct(dto);
  }

  // Link single
  @Post('link')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountRole.MOD)
  linkProductToCategory(@Body() dto: CreateProductCategoryDto) {
    return this.productCategoriesService.linkProductToCategory(dto);
  }

  // Unlink single
  @Delete('unlink/:productId/:categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountRole.MOD)
  @HttpCode(204)
  async unlinkProductFromCategory(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    await this.productCategoriesService.unlinkProductFromCategory(
      productId,
      categoryId,
    );
  }

  // Remove by link id (admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AccountRole.ADMIN)
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productCategoriesService.remove(id);
  }
}
