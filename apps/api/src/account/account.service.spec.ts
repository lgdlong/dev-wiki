import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { AccountRole } from 'src/common/enums/account-role.enum'; // sửa relative path nếu cần
import { AccountStatus } from 'src/common/enums/account-status.enum';
import { DEFAULT_SALT_ROUNDS } from 'src/common/constants'; // sửa relative path nếu cần

const mockAccount = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword',
  avatar_url: null,
  role: AccountRole.USER,
  status: AccountStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
} as any;

const mockAccountArray = [
  { ...mockAccount },
  { ...mockAccount, id: 2, email: 'user2@example.com' },
];

// Mock TypeORM repository
const mockRepo = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

// Mock ConfigService
const mockConfigService = () => ({
  get: jest.fn(),
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

describe('AccountService', () => {
  let service: AccountService;
  let repo: jest.Mocked<Repository<Account>>;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: getRepositoryToken(Account), useFactory: mockRepo },
        { provide: ConfigService, useFactory: mockConfigService },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repo = module.get(getRepositoryToken(Account));
    configService = module.get(ConfigService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all accounts', async () => {
      repo.find.mockResolvedValue(mockAccountArray as any);
      const result = await service.findAll();
      expect(result).toEqual(mockAccountArray);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an account by id', async () => {
      repo.findOne.mockResolvedValue(mockAccount as any);
      const result = await service.findOne(1);
      expect(result).toEqual(mockAccount);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
    it('should return null if account not found', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findOne(99);
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return an account by email', async () => {
      repo.findOne.mockResolvedValue(mockAccount as any);
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockAccount);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
    it('should return null if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.findByEmail('none@example.com');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should throw ConflictException if email already exists', async () => {
      repo.findOne.mockResolvedValue(mockAccount as any);
      await expect(
        service.create({
          email: mockAccount.email,
          password: 'abc',
          name: 'Test User',
          role: AccountRole.USER,
        } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should create a new account and hash password', async () => {
      repo.findOne.mockResolvedValue(null); // Email chưa tồn tại
      configService.get.mockReturnValue('10');
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      repo.create.mockReturnValue(mockAccount);
      repo.save.mockResolvedValue(mockAccount);

      const result = await service.create({
        email: 'new@example.com',
        password: 'abc',
        name: 'New User',
        role: AccountRole.USER,
      } as any);

      expect(configService.get).toHaveBeenCalledWith(
        'HASH_SALT_ROUNDS',
        expect.any(String),
      );
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('abc', 'salt');
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'new@example.com',
          password: 'hashedPassword',
        }),
      );
      expect(result).toEqual(mockAccount);
    });

    it('should hash and create even if password is empty (edge case)', async () => {
      repo.findOne.mockResolvedValue(null);
      configService.get.mockReturnValue('10');
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      repo.create.mockReturnValue(mockAccount);
      repo.save.mockResolvedValue(mockAccount);

      const result = await service.create({
        email: 'empty@example.com',
        password: '', // edge case: empty password
        name: 'No Password',
        role: AccountRole.USER,
      } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('', 'salt');
      expect(result).toEqual(mockAccount);
    });

    it('should create account even if role is unknown (edge case)', async () => {
      repo.findOne.mockResolvedValue(null);
      configService.get.mockReturnValue('10');
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      repo.create.mockReturnValue(mockAccount);
      repo.save.mockResolvedValue(mockAccount);

      const weirdRole = 'strange_role' as any;

      const result = await service.create({
        email: 'strange@example.com',
        password: 'abc',
        name: 'Strange',
        role: weirdRole,
      });

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: weirdRole }),
      );
      expect(result).toEqual(mockAccount);
    });

    it('should use DEFAULT_SALT_ROUNDS if config returns invalid value', async () => {
      repo.findOne.mockResolvedValue(null);
      configService.get.mockReturnValue('abc'); // invalid salt rounds
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      repo.create.mockReturnValue(mockAccount);
      repo.save.mockResolvedValue(mockAccount);

      const result = await service.create({
        email: 'invalidsalt@example.com',
        password: 'abc',
        name: 'Invalid Salt',
        role: AccountRole.USER,
      } as any);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(DEFAULT_SALT_ROUNDS);
      expect(result).toEqual(mockAccount);
    });

    it('should use DEFAULT_SALT_ROUNDS if config returns number less than 4', async () => {
      repo.findOne.mockResolvedValue(null);
      configService.get.mockReturnValue('2'); // less than 4
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      repo.create.mockReturnValue(mockAccount);
      repo.save.mockResolvedValue(mockAccount);

      const result = await service.create({
        email: 'smallrounds@example.com',
        password: 'abc',
        name: 'Small Salt',
        role: AccountRole.USER,
      } as any);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(DEFAULT_SALT_ROUNDS);
      expect(result).toEqual(mockAccount);
    });
  });

  describe('update', () => {
    it('should return updated account', async () => {
      repo.update.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      } as any);
      repo.findOne.mockResolvedValue({
        ...mockAccount,
        role: AccountRole.MOD,
      } as any);

      const result = await service.update(1, { role: AccountRole.MOD } as any);

      expect(repo.update).toHaveBeenCalledWith(1, { role: AccountRole.MOD });
      expect(result).toEqual(
        expect.objectContaining({ role: AccountRole.MOD }),
      );
    });

    it('should return null if account not found', async () => {
      repo.update.mockResolvedValue({
        affected: 0,
        raw: {},
        generatedMaps: [],
      } as any);
      const result = await service.update(99, { role: AccountRole.MOD } as any);
      expect(result).toBeNull();
    });

    it('should throw error if account was deleted during update operation', async () => {
      repo.update.mockResolvedValue({
        affected: 1,
        raw: {},
        generatedMaps: [],
      } as any);
      repo.findOne.mockResolvedValue(null); // Account đã bị xóa ngay sau khi update

      await expect(
        service.update(1, { role: AccountRole.MOD } as any),
      ).rejects.toThrow('Account was deleted during update operation');
    });
  });

  describe('remove', () => {
    it('should return {deleted: true} if account deleted', async () => {
      repo.delete.mockResolvedValue({
        affected: 1,
        raw: {},
      } as any);
      const result = await service.remove(1);
      expect(result).toEqual({ deleted: true });
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should return {deleted: false} if nothing deleted', async () => {
      repo.delete.mockResolvedValue({
        affected: 0,
        raw: {},
      } as any);
      const result = await service.remove(123);
      expect(result).toEqual({ deleted: false });
    });
  });
});
