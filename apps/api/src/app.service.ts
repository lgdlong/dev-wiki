import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource, // Inject DataSource to manage database connections
  ) {}
  // async testDbConnection(): Promise<string> {
  //   try {
  //     // Gọi method test kết nối
  //     await this.dataSource.query('SELECT 1');
  //     console.log('Database connection successful!');
  //     return 'Database connection successful!';
  //   } catch (error) {
  //     console.error('Database connection failed:', error);
  //     throw error;
  //   }
  // }
}
