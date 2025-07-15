import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategoriesService } from '../product-categories.service';
import { ProductCategory } from '../entities/product-category.entity';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ProductCategoriesService', () => {
  let service: ProductCategoriesService;
  let repository: Repository<ProductCategory>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCategoriesService,
        {
          provide: getRepositoryToken(ProductCategory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductCategoriesService>(ProductCategoriesService);
    repository = module.get<Repository<ProductCategory>>(
      getRepositoryToken(ProductCategory),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('linkProductToCategory', () => {
    it('should link product to category', async () => {
      const createDto: CreateProductCategoryDto = {
        productId: 1,
        categoryId: 2,
      };

      const savedLink = { id: 1, ...createDto };

      mockRepository.findOne.mockResolvedValue(null); // No existing link
      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockResolvedValue(savedLink);

      const result = await service.linkProductToCategory(createDto);

      expect(result).toEqual(savedLink);
    });

    it('should throw ConflictException if link already exists', async () => {
      const createDto: CreateProductCategoryDto = {
        productId: 1,
        categoryId: 2,
      };

      const existingLink = { id: 1, productId: 1, categoryId: 2 };
      mockRepository.findOne.mockResolvedValue(existingLink);

      await expect(service.linkProductToCategory(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('unlinkProductFromCategory', () => {
    it('should unlink product from category', async () => {
      const link = { id: 1, productId: 1, categoryId: 2 };

      mockRepository.findOne.mockResolvedValue(link);
      mockRepository.remove.mockResolvedValue(link);

      await service.unlinkProductFromCategory(1, 2);

      expect(mockRepository.remove).toHaveBeenCalledWith(link);
    });

    it('should throw NotFoundException if link not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.unlinkProductFromCategory(1, 2)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProductCategories', () => {
    it('should return categories for a product', async () => {
      const links = [
        {
          id: 1,
          productId: 1,
          categoryId: 2,
          category: { id: 2, name: 'Tech' },
        },
        {
          id: 2,
          productId: 1,
          categoryId: 3,
          category: { id: 3, name: 'Tools' },
        },
      ];

      mockRepository.find.mockResolvedValue(links);

      const result = await service.getProductCategories(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { productId: 1 },
        relations: ['category'],
      });
      expect(result).toEqual(links);
    });
  });

  describe('getCategoryProducts', () => {
    it('should return products for a category', async () => {
      const links = [
        {
          id: 1,
          productId: 1,
          categoryId: 2,
          product: { id: 1, name: 'Product 1' },
        },
        {
          id: 2,
          productId: 3,
          categoryId: 2,
          product: { id: 3, name: 'Product 3' },
        },
      ];

      mockRepository.find.mockResolvedValue(links);

      const result = await service.getCategoryProducts(2);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { categoryId: 2 },
        relations: ['product'],
      });
      expect(result).toEqual(links);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if link not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
});
