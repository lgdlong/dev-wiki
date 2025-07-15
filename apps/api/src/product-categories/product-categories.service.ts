import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async linkProductToCategory(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    // Check if link already exists
    const existingLink = await this.productCategoryRepository.findOne({
      where: {
        productId: createProductCategoryDto.productId,
        categoryId: createProductCategoryDto.categoryId,
      },
    });

    if (existingLink) {
      throw new ConflictException('Product is already linked to this category');
    }

    const productCategory = this.productCategoryRepository.create(createProductCategoryDto);
    return await this.productCategoryRepository.save(productCategory);
  }

  async unlinkProductFromCategory(productId: number, categoryId: number): Promise<void> {
    const link = await this.productCategoryRepository.findOne({
      where: { productId, categoryId },
    });

    if (!link) {
      throw new NotFoundException('Product-category link not found');
    }

    await this.productCategoryRepository.remove(link);
  }

  async getProductCategories(productId: number): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find({
      where: { productId },
      relations: ['category'],
    });
  }

  async getCategoryProducts(categoryId: number): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find({
      where: { categoryId },
      relations: ['product'],
    });
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find({
      relations: ['product', 'category'],
    });
  }

  async findOne(id: number): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { id },
      relations: ['product', 'category'],
    });

    if (!productCategory) {
      throw new NotFoundException(`Product-category link with ID ${id} not found`);
    }

    return productCategory;
  }

  async remove(id: number): Promise<void> {
    const productCategory = await this.findOne(id);
    await this.productCategoryRepository.remove(productCategory);
  }
}