import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import {
  AssignCategoriesDto,
  AssignCategoriesResponseDto,
} from './dto/assign-categories.dto';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
    private dataSource: DataSource,
  ) {}

  async linkProductToCategory(
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<ProductCategory> {
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

    const productCategory = this.productCategoryRepository.create(
      createProductCategoryDto,
    );
    return await this.productCategoryRepository.save(productCategory);
  }

  async unlinkProductFromCategory(
    productId: number,
    categoryId: number,
  ): Promise<void> {
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
      throw new NotFoundException(
        `Product-category link with ID ${id} not found`,
      );
    }

    return productCategory;
  }

  async remove(id: number): Promise<void> {
    const productCategory = await this.findOne(id);
    await this.productCategoryRepository.remove(productCategory);
  }

  async assignCategoriesToProduct({
    productId,
    categoryIds,
  }: AssignCategoriesDto): Promise<AssignCategoriesResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const productRepo = manager.getRepository(Product);
      const categoryRepo = manager.getRepository(Category);
      const pcRepo: Repository<ProductCategory> =
        manager.getRepository(ProductCategory);

      // 1) Check the product exists
      const exists = await productRepo.exist({ where: { id: productId } });
      if (!exists)
        throw new NotFoundException(`Product ${productId} not found`);

      // 2) Check categories exist
      const found = await categoryRepo.find({
        where: { id: In(categoryIds) },
        select: ['id'],
      });
      const foundIds = new Set(found.map((c) => c.id));
      const missing = categoryIds.filter((id) => !foundIds.has(id));
      if (missing.length) {
        // hoặc BadRequestException tùy convention
        throw new NotFoundException(
          `Categories not found: [${missing.join(', ')}]`,
        );
      }

      // 3) Find already assigned
      const existing = await pcRepo.find({
        where: { productId, categoryId: In(categoryIds) },
        select: ['categoryId'],
      });
      const alreadyAssignedIds = new Set(existing.map((e) => e.categoryId));

      const toInsert = categoryIds
        .filter((id) => !alreadyAssignedIds.has(id))
        .map((categoryId) => ({ productId, categoryId }));

      // 4) Insert with conflict ignore (Postgres)
      if (toInsert.length) {
        await pcRepo
          .createQueryBuilder()
          .insert()
          .into(ProductCategory)
          .values(toInsert)
          .orIgnore() // << tránh race unique conflict
          .execute();
      }

      // 5) Total after
      const total = await pcRepo.count({ where: { productId } });

      return {
        assigned: toInsert.length,
        skipped: alreadyAssignedIds.size,
        total,
        newlyAssigned: toInsert.map((x) => x.categoryId),
        alreadyAssigned: Array.from(alreadyAssignedIds),
      };
    });
  }
}
