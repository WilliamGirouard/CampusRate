import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PlacesModule } from './places/places.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';

@Module({
  imports: [
    PlacesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
