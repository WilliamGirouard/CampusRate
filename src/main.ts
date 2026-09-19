import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { configureSwagger } from '../configure-swagger.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Supprime les proprietes non definies dans le DTO.
      forbidNonWhitelisted: true, // Lance une erreur quand il y a une propriete que l'on ne veut pas
      transform: true, // S'assure de bien transformer avec le class-transformer
    }),
  );
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
