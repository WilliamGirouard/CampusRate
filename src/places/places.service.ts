import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './repository/places.repository.js';
import { Place } from './entities/place.entity.js';
import { CreatePlaceDto } from './dto/create-places.dto.js';
import { PlaceStatusEnum } from './enum/place.status.enum.js';
import { idGenerator } from '../common/generator/id.generator.js';
import { UpdatePlaceDto } from './dto/update-places.dto.js';

@Injectable()
export class PlacesService {
    constructor(private readonly placeRepository: PlaceRepository) { }

    async findAllPlace(): Promise<Place[]> {
        return await this.placeRepository.findAllPlaces();
    }
    async findOnePlaceById(id : string): Promise<Place> {
        const place = await this.placeRepository.findOnePlaceById(id);
        if (!place) {
            throw new NotFoundException(`Couldn't find place with id ${id}`);
        }
        return place;
    }
    async createOnePlace(dto : CreatePlaceDto) : Promise<Place> {
        const currentDate = new Date();
        const newPlace: Place = {
            id: "plc_" + Math.random().toString(36).slice(2, 11).toUpperCase().padEnd(9, "0"),
            name: dto.name,
            description: dto.description,
            category: dto.category,
            address: dto.address,
            services: dto.services ?? [],
            status: dto.status ?? PlaceStatusEnum.ACTIVE,
            averageRating: null,
            reviewCount: 0,
            createdAt: currentDate,
            updatedAt: currentDate,
        };
        return await this.placeRepository.createOnePlace(newPlace);
    }
    async updateOnePlace(id : string, dto : UpdatePlaceDto) : Promise<Place> {
        const updatedPlace = await this.placeRepository.updateOnePlace(id, dto);
        if (!updatedPlace) {
            throw new NotFoundException(`Couldn't find place with id ${id}`);
        }
        return updatedPlace;
    }

}
