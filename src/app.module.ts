import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { StorageModule } from './storage/storage.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot( {
      isGlobal: true,
      validationSchema : Joi.object({
        PORT: Joi.number().default(3000),
        MONGO_URI: Joi.string().required()
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService : ConfigService) => ({
        uri: configService.get<string>("MONGO_URI"),
      }),
      inject: [ConfigService]
    }),
    PlacesModule,
    ReviewsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
