import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { configureSwagger } from './config/configure-swagger.js';
import { ProblemDetailsFilter } from './common/filters/problem-details.filter.js';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  const corsOrigins = process.env.CORS_ORIGINS ?? "http://localhost:3000"
  app.enableCors({
    origin: corsOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  configureSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Supprime les proprietes non definies dans le DTO.
      forbidNonWhitelisted: true, // Lance une erreur quand il y a une propriete que l'on ne veut pas
      transform: true, // S'assure de bien transformer avec le class-transformer
      stopAtFirstError: false,
    }),
  );
  app.useGlobalFilters(new ProblemDetailsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
