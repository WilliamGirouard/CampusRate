import { forwardRef, Module } from '@nestjs/common';
import { PlacesController } from './places.controller.js';
import { PlacesService } from './places.service.js';
import { StorageModule } from '../storage/storage.module.js';
import { PlaceRepository } from './repository/places.repository.js';
import { ReviewsModule } from '../reviews/reviews.module.js';

@Module({
  imports:[StorageModule, forwardRef(() => ReviewsModule)],
  controllers: [PlacesController],
  providers: [PlacesService, PlaceRepository],
  exports: [PlacesService]
})
export class PlacesModule {}
