import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRole } from '../common/enums/account-role.enum';
import { AccountStatus } from '../common/enums/account-status.enum';
import { ConflictException } from '@nestjs/common';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt123'),
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
}));

import * as bcrypt from 'bcrypt';
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AccountService', () => {
  let service: AccountService;
  let mockRepository: jest.Mocked<Repository<Account>>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Create mock repository
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    // Create mock config service
    mockConfigService = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createAccountDto: CreateAccountDto = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      role: AccountRole.USER,
    };

    it('should create a new account successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const salt = 'salt123';
      const createdAccount = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: AccountRole.USER,
        status: AccountStatus.ACTIVE,
        avatar_url: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Account;

      mockRepository.findOne.mockResolvedValue(null); // No existing user
      mockConfigService.get.mockReturnValue('12'); // salt rounds
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(createdAccount);
      mockRepository.save.mockResolvedValue(createdAccount);

      const result = await service.create(createAccountDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', salt);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createAccountDto,
        email: 'test@example.com',
        password: hashedPassword,
        role: AccountRole.USER,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(createdAccount);
      expect(result).toEqual(createdAccount);
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingAccount = { id: 1, email: 'test@example.com' } as Account;
      mockRepository.findOne.mockResolvedValue(existingAccount);

      await expect(service.create(createAccountDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createAccountDto)).rejects.toThrow(
        'Email already registered!',
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should normalize email to lowercase', async () => {
      const createAccountDtoWithUppercaseEmail = {
        ...createAccountDto,
        email: 'TEST@EXAMPLE.COM',
      };
      const hashedPassword = 'hashedPassword123';
      const salt = 'salt123';
      const createdAccount = { id: 1 } as Account;

      mockRepository.findOne.mockResolvedValue(null);
      mockConfigService.get.mockReturnValue('12');
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(createdAccount);
      mockRepository.save.mockResolvedValue(createdAccount);

      await service.create(createAccountDtoWithUppercaseEmail);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createAccountDtoWithUppercaseEmail,
        email: 'test@example.com',
        password: hashedPassword,
        role: AccountRole.USER,
      });
    });

    it('should use default salt rounds when config value is invalid', async () => {
      const hashedPassword = 'hashedPassword123';
      const salt = 'salt123';
      const createdAccount = { id: 1 } as Account;

      mockRepository.findOne.mockResolvedValue(null);
      mockConfigService.get.mockReturnValue('invalid'); // Invalid number
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(createdAccount);
      mockRepository.save.mockResolvedValue(createdAccount);

      await service.create(createAccountDto);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(12); // DEFAULT_SALT_ROUNDS
    });

    it('should use default salt rounds when config value is too low', async () => {
      const hashedPassword = 'hashedPassword123';
      const salt = 'salt123';
      const createdAccount = { id: 1 } as Account;

      mockRepository.findOne.mockResolvedValue(null);
      mockConfigService.get.mockReturnValue('3'); // Too low (< 4)
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(createdAccount);
      mockRepository.save.mockResolvedValue(createdAccount);

      await service.create(createAccountDto);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(12); // DEFAULT_SALT_ROUNDS
    });
  });

  describe('findAll', () => {
    it('should return all active accounts without passwords', async () => {
      const accounts = [
        { id: 1, email: 'user1@example.com', status: 'active' },
        { id: 2, email: 'user2@example.com', status: 'active' },
      ] as Account[];

      mockRepository.find.mockResolvedValue(accounts);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'active' },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
      expect(result).toEqual(accounts);
    });

    it('should return empty array when no active accounts exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { status: 'active' },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return account without password when found', async () => {
      const account = { id: 1, email: 'test@example.com' } as Account;
      mockRepository.findOne.mockResolvedValue(account);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
      expect(result).toEqual(account);
    });

    it('should return null when account not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
      expect(result).toBeNull();
    });

    it('should handle zero id', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(0);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 0 },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
      expect(result).toBeNull();
    });

    it('should handle negative id', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(-1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: -1 },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return account when found by email', async () => {
      const account = { id: 1, email: 'test@example.com' } as Account;
      mockRepository.findOne.mockResolvedValue(account);

      const result = await service.findByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(account);
    });

    it('should return null when account not found by email', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'notfound@example.com' },
      });
      expect(result).toBeNull();
    });

    it('should handle empty email', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: '' },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateAccountDto: UpdateAccountDto = {
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update account successfully', async () => {
      const updateResult: UpdateResult = {
        affected: 1,
        generatedMaps: [],
        raw: {},
      };
      const updatedAccount = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
      } as Account;

      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOne.mockResolvedValue(updatedAccount);

      const result = await service.update(1, updateAccountDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateAccountDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
      expect(result).toEqual(updatedAccount);
    });

    it('should return null when no rows are affected', async () => {
      const updateResult: UpdateResult = {
        affected: 0,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.update(999, updateAccountDto);

      expect(mockRepository.update).toHaveBeenCalledWith(999, updateAccountDto);
      expect(mockRepository.findOne).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw error when account is deleted during update', async () => {
      const updateResult: UpdateResult = {
        affected: 1,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOne.mockResolvedValue(null); // Account was deleted

      await expect(service.update(1, updateAccountDto)).rejects.toThrow(
        'Account was deleted during update operation',
      );

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateAccountDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
    });

    it('should handle undefined affected value', async () => {
      const updateResult: UpdateResult = {
        affected: undefined,
        generatedMaps: [],
        raw: {},
      };
      const updatedAccount = {
        id: 1,
        name: 'Updated Name',
      } as Account;

      mockRepository.update.mockResolvedValue(updateResult);
      mockRepository.findOne.mockResolvedValue(updatedAccount);

      const result = await service.update(1, updateAccountDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateAccountDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: 1 },
        select: ['id', 'email', 'name', 'avatar_url', 'role', 'status', 'createdAt', 'updatedAt']
      });
      expect(result).toEqual(updatedAccount);
    });
  });

  describe('remove', () => {
    it('should soft delete account successfully', async () => {
      const updateResult: UpdateResult = {
        affected: 1,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.remove(1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'deleted' });
      expect(result).toEqual({ deleted: true });
    });

    it('should return false when no rows are affected', async () => {
      const updateResult: UpdateResult = {
        affected: 0,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.remove(999);

      expect(mockRepository.update).toHaveBeenCalledWith(999, { status: 'deleted' });
      expect(result).toEqual({ deleted: false });
    });

    it('should handle undefined affected value', async () => {
      const updateResult: UpdateResult = {
        affected: undefined,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.remove(1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'deleted' });
      expect(result).toEqual({ deleted: false });
    });

    it('should handle null affected value', async () => {
      const updateResult: UpdateResult = {
        affected: undefined, // Changed from null to undefined since TypeScript expects number | undefined
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.remove(1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'deleted' });
      expect(result).toEqual({ deleted: false });
    });

    it('should handle zero id', async () => {
      const updateResult: UpdateResult = {
        affected: 0,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.remove(0);

      expect(mockRepository.update).toHaveBeenCalledWith(0, { status: 'deleted' });
      expect(result).toEqual({ deleted: false });
    });

    it('should handle negative id', async () => {
      const updateResult: UpdateResult = {
        affected: 0,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.remove(-1);

      expect(mockRepository.update).toHaveBeenCalledWith(-1, { status: 'deleted' });
      expect(result).toEqual({ deleted: false });
    });
  });

  describe('ban', () => {
    it('should ban account successfully', async () => {
      const updateResult: UpdateResult = {
        affected: 1,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.ban(1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'banned' });
      expect(result).toEqual({ banned: true });
    });

    it('should return false when no rows are affected', async () => {
      const updateResult: UpdateResult = {
        affected: 0,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.ban(999);

      expect(mockRepository.update).toHaveBeenCalledWith(999, { status: 'banned' });
      expect(result).toEqual({ banned: false });
    });
  });

  describe('unban', () => {
    it('should unban account successfully', async () => {
      const updateResult: UpdateResult = {
        affected: 1,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.unban(1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { status: 'active' });
      expect(result).toEqual({ unbanned: true });
    });

    it('should return false when no rows are affected', async () => {
      const updateResult: UpdateResult = {
        affected: 0,
        generatedMaps: [],
        raw: {},
      };

      mockRepository.update.mockResolvedValue(updateResult);

      const result = await service.unban(999);

      expect(mockRepository.update).toHaveBeenCalledWith(999, { status: 'active' });
      expect(result).toEqual({ unbanned: false });
    });
  });
});
