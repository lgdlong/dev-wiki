import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test-db')
  async testDb() {
    return this.appService.testDbConnection();
  }

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
