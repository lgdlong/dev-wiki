import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GoogleProfile } from './auth/interfaces/google-profile.interface';
import { Request } from 'express';
import { GoogleLoginResult } from './types/google-login-result.type';

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource, // Inject DataSource to manage database connections
  ) {}

  googleLogin(req: Request): GoogleLoginResult {
    if (!req.user) {
      return { message: 'No user from google' };
    }
    return {
      message: 'User information from google',
      user: req.user as GoogleProfile,
    };
  }

  /**
   * Tests the database connection by executing a simple query.
   * This method can be used for debugging or health checks.
   */
  async testDbConnection(): Promise<string> {
    try {
      // Execute a simple query to test the database connection
      await this.dataSource.query('SELECT 1 as test');
      console.log('Database connection successful!');
      return 'Database connection successful! Connected to Render PostgreSQL.';
    } catch (error) {
      console.error('Database connection failed:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Database connection failed: ${errorMessage}`);
    }
  }
}
