import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { PlacesModule } from '../places/places.module.js';

@Module({
  imports:[PlacesModule],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
