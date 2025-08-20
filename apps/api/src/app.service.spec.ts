import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { GoogleProfile } from './modules/auth/interfaces/google-profile.interface';
import { GoogleLoginResult } from './shared/types/google-login-result.type';

describe('AppService', () => {
  let service: AppService;
  let mockDataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    // Create mock DataSource
    mockDataSource = {
      query: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleLogin', () => {
    it('should return error message when no user in request', () => {
      const mockRequest = { user: null } as unknown as Request;

      const result: GoogleLoginResult = service.googleLogin(mockRequest);

      expect(result).toEqual({ message: 'No user from google' });
    });

    it('should return success message with user when user exists in request', () => {
      const mockGoogleProfile: GoogleProfile = {
        googleId: '123456789',
        email: 'test@example.com',
        emailVerified: true,
        name: 'Test User',
        givenName: 'Test',
        avatar: 'https://example.com/avatar.jpg',
        provider: 'google',
      };

      const mockRequest = { user: mockGoogleProfile } as unknown as Request;

      const result: GoogleLoginResult = service.googleLogin(mockRequest);

      expect(result).toEqual({
        message: 'User information from google',
        user: mockGoogleProfile,
      });
    });

    it('should return error message when user is undefined', () => {
      const mockRequest = { user: undefined } as unknown as Request;

      const result: GoogleLoginResult = service.googleLogin(mockRequest);

      expect(result).toEqual({ message: 'No user from google' });
    });

    it('should handle request without user property', () => {
      const mockRequest = {} as unknown as Request;

      const result: GoogleLoginResult = service.googleLogin(mockRequest);

      expect(result).toEqual({ message: 'No user from google' });
    });
  });

  describe('testDbConnection', () => {
    it('should return success message when database connection is successful', async () => {
      mockDataSource.query.mockResolvedValue([{ test: 1 }]);

      const result = await service.testDbConnection();

      expect(result).toBe(
        'Database connection successful! Connected to Render PostgreSQL.',
      );
      expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1 as test');
      expect(mockDataSource.query).toHaveBeenCalledTimes(1);
    });

    it('should throw error when database connection fails with Error instance', async () => {
      const errorMessage = 'Connection timeout';
      mockDataSource.query.mockRejectedValue(new Error(errorMessage));

      await expect(service.testDbConnection()).rejects.toThrow(
        `Database connection failed: ${errorMessage}`,
      );
      expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1 as test');
      expect(mockDataSource.query).toHaveBeenCalledTimes(1);
    });

    it('should throw error when database connection fails with non-Error instance', async () => {
      const errorMessage = 'Unknown database error';
      mockDataSource.query.mockRejectedValue(errorMessage);

      await expect(service.testDbConnection()).rejects.toThrow(
        'Database connection failed: Unknown error',
      );
      expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1 as test');
      expect(mockDataSource.query).toHaveBeenCalledTimes(1);
    });

    it('should throw error when database connection fails with null', async () => {
      mockDataSource.query.mockRejectedValue(null);

      await expect(service.testDbConnection()).rejects.toThrow(
        'Database connection failed: Unknown error',
      );
      expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1 as test');
      expect(mockDataSource.query).toHaveBeenCalledTimes(1);
    });

    it('should throw error when database connection fails with undefined', async () => {
      mockDataSource.query.mockRejectedValue(undefined);

      await expect(service.testDbConnection()).rejects.toThrow(
        'Database connection failed: Unknown error',
      );
      expect(mockDataSource.query).toHaveBeenCalledWith('SELECT 1 as test');
      expect(mockDataSource.query).toHaveBeenCalledTimes(1);
    });
  });
});
