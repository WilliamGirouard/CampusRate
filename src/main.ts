import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { configureSwagger } from './config/configure-swagger.js';
import { ProblemDetailsFilter } from './common/filters/problem-details.filter.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json, NextFunction, Request, Response } from 'express';
import selfsigned from 'selfsigned';

async function bootstrap() {

  const pems = await selfsigned.generate([{ name: "commonName", value: "localhost" }]);
  const httpsOptions = {
    key: pems.private,
    cert: pems.cert,
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  const allowed = ["GET", "POST", "PATCH", "DELETE"];
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!allowed.includes(req.method.toUpperCase())) {
      return res.status(405).json({
        statusCode: 405,
        message: "This HTTP Method is not allowed..."
      });
    }
    next();
  })
  app.use(rateLimit({
    windowMs: 60000,
    max: 100,
  }));
  app.use(json({ limit: "5kb" }));
  app.use(helmet());
  const corsOrigins = process.env.CORS_ORIGINS ?? "https://localhost:3000"
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
