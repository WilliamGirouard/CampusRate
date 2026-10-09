import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { PlacesModule } from '../places/places.module.js';
import { ReviewRepository } from './repository/reviews.repository.js';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema, Review } from './schemas/review.schema.js';

@Module({
  imports:[MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema}]), forwardRef(() => PlacesModule) ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
  exports: [ReviewsService, ReviewRepository],
})
export class ReviewsModule {}
