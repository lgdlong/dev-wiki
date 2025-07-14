import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AccountRole } from '../common/enums/account-role.enum';
import { Account } from '../account/entities/account.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthAccountResponse } from './interfaces/auth-account-response.interface';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

import * as bcrypt from 'bcrypt';
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let mockAccountService: jest.Mocked<AccountService>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    // Create mock services
    mockAccountService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as any;

    mockJwtService = {
      signAsync: jest.fn(),
      sign: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = 'hashedPassword123';
    const mockAccount: Account = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      role: AccountRole.USER,
      avatar_url: 'https://example.com/avatar.jpg',
    } as Account;

    it('should validate user successfully and return JWT token with account', async () => {
      const accessToken = 'jwt.token.here';
      const expectedPayload: JwtPayload = {
        sub: mockAccount.id,
        email: mockAccount.email,
        role: mockAccount.role,
        name: mockAccount.name,
      };
      const expectedAccountResponse: AuthAccountResponse = {
        id: mockAccount.id,
        email: mockAccount.email,
        role: mockAccount.role,
        name: mockAccount.name,
        avatar_url: mockAccount.avatar_url,
      };

      mockAccountService.findByEmail.mockResolvedValue(mockAccount);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.validateUser(email, password);

      expect(mockAccountService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(expectedPayload);
      expect(result).toEqual({
        access_token: accessToken,
        account: expectedAccountResponse,
      });
    });

    it('should throw UnauthorizedException when account not found', async () => {
      mockAccountService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(email, password)).rejects.toThrow(
        'Invalid credentials!',
      );

      expect(mockAccountService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      mockAccountService.findByEmail.mockResolvedValue(mockAccount);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(email, password)).rejects.toThrow(
        'Invalid credentials!',
      );

      expect(mockAccountService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should handle account without avatar_url', async () => {
      const accountWithoutAvatar = {
        ...mockAccount,
        avatar_url: undefined,
      } as Account;
      const accessToken = 'jwt.token.here';

      mockAccountService.findByEmail.mockResolvedValue(accountWithoutAvatar);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.validateUser(email, password);

      expect(result.account.avatar_url).toBeUndefined();
    });

    it('should handle account with different role', async () => {
      const adminAccount = {
        ...mockAccount,
        role: AccountRole.ADMIN,
      } as Account;
      const accessToken = 'jwt.token.here';
      const expectedPayload: JwtPayload = {
        sub: adminAccount.id,
        email: adminAccount.email,
        role: AccountRole.ADMIN,
        name: adminAccount.name,
      };

      mockAccountService.findByEmail.mockResolvedValue(adminAccount);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.validateUser(email, password);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(expectedPayload);
      expect(result.account.role).toBe(AccountRole.ADMIN);
    });

    it('should handle empty email', async () => {
      mockAccountService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser('', password)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockAccountService.findByEmail).toHaveBeenCalledWith('');
    });

    it('should handle empty password', async () => {
      mockAccountService.findByEmail.mockResolvedValue(mockAccount);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(email, '')).rejects.toThrow(
        UnauthorizedException,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith('', hashedPassword);
    });
  });

  describe('register', () => {
    const registerUserDto: RegisterUserDto = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'password123',
    };

    it('should register user successfully', async () => {
      const expectedCreateAccountDto = {
        ...registerUserDto,
        role: AccountRole.USER,
      };

      mockAccountService.create.mockResolvedValue({} as Account);

      const result = await service.register(registerUserDto);

      expect(mockAccountService.create).toHaveBeenCalledWith(
        expectedCreateAccountDto,
      );
      expect(result).toEqual({
        message: 'Registration successful! Please login to continue.',
      });
    });

    it('should pass through any error from AccountService.create', async () => {
      const error = new Error('Email already exists');
      mockAccountService.create.mockRejectedValue(error);

      await expect(service.register(registerUserDto)).rejects.toThrow(error);

      expect(mockAccountService.create).toHaveBeenCalledWith({
        ...registerUserDto,
        role: AccountRole.USER,
      });
    });

    it('should handle registration with different user data', async () => {
      const differentUserDto: RegisterUserDto = {
        email: 'different@example.com',
        name: 'Different User',
        password: 'differentpassword',
      };

      mockAccountService.create.mockResolvedValue({} as Account);

      const result = await service.register(differentUserDto);

      expect(mockAccountService.create).toHaveBeenCalledWith({
        ...differentUserDto,
        role: AccountRole.USER,
      });
      expect(result).toEqual({
        message: 'Registration successful! Please login to continue.',
      });
    });

    it('should handle empty name', async () => {
      const userDtoWithEmptyName = {
        ...registerUserDto,
        name: '',
      };

      mockAccountService.create.mockResolvedValue({} as Account);

      await service.register(userDtoWithEmptyName);

      expect(mockAccountService.create).toHaveBeenCalledWith({
        ...userDtoWithEmptyName,
        role: AccountRole.USER,
      });
    });

    it('should handle empty email', async () => {
      const userDtoWithEmptyEmail = {
        ...registerUserDto,
        email: '',
      };

      mockAccountService.create.mockResolvedValue({} as Account);

      await service.register(userDtoWithEmptyEmail);

      expect(mockAccountService.create).toHaveBeenCalledWith({
        ...userDtoWithEmptyEmail,
        role: AccountRole.USER,
      });
    });
  });

  describe('generateJwt', () => {
    it('should generate JWT token from payload', () => {
      const payload: JwtPayload = {
        sub: 1,
        email: 'test@example.com',
        role: AccountRole.USER,
        name: 'Test User',
      };
      const expectedToken = 'generated.jwt.token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateJwt(payload);

      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toBe(expectedToken);
    });

    it('should handle payload with optional fields', () => {
      const payloadWithOptionals: JwtPayload = {
        sub: 1,
        email: 'test@example.com',
        role: AccountRole.ADMIN,
        name: 'Admin User',
        avatar: 'https://example.com/avatar.jpg',
        provider: 'google',
      };
      const expectedToken = 'generated.jwt.token.with.optionals';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateJwt(payloadWithOptionals);

      expect(mockJwtService.sign).toHaveBeenCalledWith(payloadWithOptionals);
      expect(result).toBe(expectedToken);
    });

    it('should handle payload with string sub (googleId)', () => {
      const payloadWithStringSub: JwtPayload = {
        sub: 'google-123456789',
        email: 'googleuser@example.com',
        role: AccountRole.USER,
        name: 'Google User',
        provider: 'google',
      };
      const expectedToken = 'google.jwt.token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateJwt(payloadWithStringSub);

      expect(mockJwtService.sign).toHaveBeenCalledWith(payloadWithStringSub);
      expect(result).toBe(expectedToken);
    });

    it('should handle payload with MOD role', () => {
      const modPayload: JwtPayload = {
        sub: 2,
        email: 'mod@example.com',
        role: AccountRole.MOD,
        name: 'Mod User',
      };
      const expectedToken = 'mod.jwt.token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateJwt(modPayload);

      expect(mockJwtService.sign).toHaveBeenCalledWith(modPayload);
      expect(result).toBe(expectedToken);
    });

    it('should handle minimal payload', () => {
      const minimalPayload: JwtPayload = {
        sub: 99,
        email: 'minimal@example.com',
        role: AccountRole.USER,
        name: 'Minimal',
      };
      const expectedToken = 'minimal.jwt.token';

      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = service.generateJwt(minimalPayload);

      expect(mockJwtService.sign).toHaveBeenCalledWith(minimalPayload);
      expect(result).toBe(expectedToken);
    });
  });
});