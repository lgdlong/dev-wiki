import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCreator: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        createdBy: 1,
      };

      const result = { id: 1, ...createProductDto };
      mockProductsService.create.mockResolvedValue(result);

      expect(await controller.create(createProductDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = [
        { id: 1, name: 'Product 1', createdBy: 1 },
        { id: 2, name: 'Product 2', createdBy: 1 },
      ];
      mockProductsService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const result = { id: 1, name: 'Product 1', createdBy: 1 };
      mockProductsService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const result = { id: 1, name: 'Updated Product', createdBy: 1 };
      mockProductsService.update.mockResolvedValue(result);

      expect(await controller.update(1, updateProductDto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByCreator', () => {
    it('should return products by creator', async () => {
      const result = [
        { id: 1, name: 'Product 1', createdBy: 1 },
        { id: 2, name: 'Product 2', createdBy: 1 },
      ];
      mockProductsService.findByCreator.mockResolvedValue(result);

      expect(await controller.findByCreator(1)).toBe(result);
      expect(service.findByCreator).toHaveBeenCalledWith(1);
    });
  });
});