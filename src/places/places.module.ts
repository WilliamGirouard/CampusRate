import { forwardRef, Module } from '@nestjs/common';
import { PlacesController } from './places.controller.js';
import { PlacesService } from './places.service.js';
import { PlaceRepository } from './repository/places.repository.js';
import { ReviewsModule } from '../reviews/reviews.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceShema, Place } from './schemas/place.schema.js';

@Module({
  imports:[MongooseModule.forFeature([{ name: Place.name, schema: PlaceShema}]), forwardRef(() => ReviewsModule)],
  controllers: [PlacesController],
  providers: [PlacesService, PlaceRepository],
  exports: [PlacesService]
})
export class PlacesModule {}
