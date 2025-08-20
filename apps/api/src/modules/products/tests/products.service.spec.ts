import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

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
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        createdBy: 1,
      };

      const savedProduct = { id: 1, ...createProductDto };

      mockRepository.create.mockReturnValue(createProductDto);
      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(createProductDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createProductDto);
      expect(result).toEqual(savedProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [
        { id: 1, name: 'Product 1', createdBy: 1 },
        { id: 2, name: 'Product 2', createdBy: 1 },
      ];

      mockRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['creator'],
      });
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { id: 1, name: 'Product 1', createdBy: 1 };

      mockRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['creator'],
      });
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const product = { id: 1, name: 'Product 1', createdBy: 1 };
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const updatedProduct = { ...product, ...updateProductDto };

      mockRepository.findOne.mockResolvedValue(product);
      mockRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateProductDto);

      expect(result).toEqual(updatedProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = { id: 1, name: 'Product 1', createdBy: 1 };

      mockRepository.findOne.mockResolvedValue(product);
      mockRepository.remove.mockResolvedValue(product);

      await service.remove(1);

      expect(mockRepository.remove).toHaveBeenCalledWith(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByCreator', () => {
    it('should return products by creator', async () => {
      const products = [
        { id: 1, name: 'Product 1', createdBy: 1 },
        { id: 2, name: 'Product 2', createdBy: 1 },
      ];

      mockRepository.find.mockResolvedValue(products);

      const result = await service.findByCreator(1);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { createdBy: 1 },
        relations: ['creator'],
      });
      expect(result).toEqual(products);
    });
  });
});
