import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource, // Inject DataSource to manage database connections
  ) {}

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
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
