import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const DEFAULT_PORT = 8000; // Default port if not specified in .env

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Lấy ConfigService từ app context
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || DEFAULT_PORT; // fallback nếu không có PORT

  // ---- Bật CORS cho FE truy cập ----
  app.enableCors({
    // FE Next.js localhost
    origin: 'http://localhost:3000',

    // Cho phép nếu dùng cookie/session/token
    // Cho phép credentials: "include" bên FE
    credentials: true,
    // Cho phép các phương thức HTTP
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

    // Cho phép các header cần thiết
    allowedHeaders: 'Content-Type,Authorization',
  });

  await app.listen(port);
}
bootstrap();
