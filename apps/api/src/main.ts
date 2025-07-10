import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const DEFAULT_PORT = 8000; // Default port if not specified in .env

  const app = await NestFactory.create(AppModule);

  // Lấy ConfigService từ app context
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || DEFAULT_PORT; // fallback nếu không có PORT

  await app.listen(port);
}
bootstrap();
