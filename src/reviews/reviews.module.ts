import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';
import { PlacesModule } from '../places/places.module.js';
import { StorageModule } from '../storage/storage.module.js';
import { ReviewRepository } from './repository/reviews.repository.js';

@Module({
  imports:[StorageModule, forwardRef(() => PlacesModule) ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository],
  exports: [ReviewsService, ReviewRepository],
})
export class ReviewsModule {}
