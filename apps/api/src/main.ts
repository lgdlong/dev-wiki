import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DEFAULT_FRONTEND_URL, DEFAULT_PORT } from './shared/constants';
// import { DocumentBuilder } from '@nestjs/swagger';
// import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Cấu hình Swagger
  // const config = new DocumentBuilder()
  //   .setTitle('API Docs')
  //   .setDescription('The API description')
  //   .setVersion('1.0')
  //   .addBearerAuth() // Nếu dùng JWT
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);

  // Lấy ConfigService từ app context
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || DEFAULT_PORT; // fallback nếu không có PORT

  // ---- Lấy FRONTEND_URL từ configService thay vì process.env ----
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') || DEFAULT_FRONTEND_URL;

  app.enableCors({
    origin: frontendUrl, // sử dụng biến lấy từ configService
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });
  await app.listen(port);
}
bootstrap();
