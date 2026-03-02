import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — strips unknown fields & rejects invalid DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API versioning prefix
  app.setGlobalPrefix('api/v1');

  // CORS — tighten in production
  app.enableCors({
    origin: process.env['NODE_ENV'] === 'production' ? false : '*',
  });

  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
  console.log(`Budget Pro API running → http://localhost:${port}/api/v1`);
}

bootstrap();
