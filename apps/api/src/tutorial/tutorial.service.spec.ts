import { Test, TestingModule } from '@nestjs/testing';
import { TutorialService } from './tutorial.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';

describe('TutorialService', () => {
  let service: TutorialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutorialService],
    }).compile();

    service = module.get<TutorialService>(TutorialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a creation message', () => {
      const createTutorialDto: CreateTutorialDto = {};
      const result = service.create(createTutorialDto);
      expect(result).toBe('This action adds a new tutorial');
    });
  });

  describe('findAll', () => {
    it('should return a find all message', () => {
      const result = service.findAll();
      expect(result).toBe('This action returns all tutorial');
    });
  });

  describe('findOne', () => {
    it('should return a find one message with id', () => {
      const id = 1;
      const result = service.findOne(id);
      expect(result).toBe('This action returns a #1 tutorial');
    });

    it('should handle different ids', () => {
      const id = 42;
      const result = service.findOne(id);
      expect(result).toBe('This action returns a #42 tutorial');
    });

    it('should handle zero id', () => {
      const id = 0;
      const result = service.findOne(id);
      expect(result).toBe('This action returns a #0 tutorial');
    });

    it('should handle negative id', () => {
      const id = -1;
      const result = service.findOne(id);
      expect(result).toBe('This action returns a #-1 tutorial');
    });
  });

  describe('update', () => {
    it('should return an update message with id', () => {
      const id = 1;
      const updateTutorialDto: UpdateTutorialDto = {};
      const result = service.update(id, updateTutorialDto);
      expect(result).toBe('This action updates a #1 tutorial');
    });

    it('should handle different ids', () => {
      const id = 99;
      const updateTutorialDto: UpdateTutorialDto = {};
      const result = service.update(id, updateTutorialDto);
      expect(result).toBe('This action updates a #99 tutorial');
    });

    it('should handle zero id', () => {
      const id = 0;
      const updateTutorialDto: UpdateTutorialDto = {};
      const result = service.update(id, updateTutorialDto);
      expect(result).toBe('This action updates a #0 tutorial');
    });
  });

  describe('remove', () => {
    it('should return a remove message with id', () => {
      const id = 1;
      const result = service.remove(id);
      expect(result).toBe('This action removes a #1 tutorial');
    });

    it('should handle different ids', () => {
      const id = 123;
      const result = service.remove(id);
      expect(result).toBe('This action removes a #123 tutorial');
    });

    it('should handle zero id', () => {
      const id = 0;
      const result = service.remove(id);
      expect(result).toBe('This action removes a #0 tutorial');
    });

    it('should handle negative id', () => {
      const id = -5;
      const result = service.remove(id);
      expect(result).toBe('This action removes a #-5 tutorial');
    });
  });
});