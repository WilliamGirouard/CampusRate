import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller.js';
import { PlacesService } from './places.service.js';
import { StorageModule } from '../storage/storage.module.js';
import { PlaceRepository } from './repository/places.repository.js';

@Module({
  imports:[StorageModule],
  controllers: [PlacesController],
  providers: [PlacesService, PlaceRepository],
  exports: [PlacesService]
})
export class PlacesModule {}
