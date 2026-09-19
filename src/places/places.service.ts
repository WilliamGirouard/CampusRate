import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './repository/places.repository.js';
import { Place } from './entities/place.entity.js';
import { CreatePlaceDto } from './dto/create-places.dto.js';
import { PlaceStatusEnum } from './enum/place.status.enum.js';
import { UpdatePlaceDto } from './dto/update-places.dto.js';
import { ReviewRepository } from '../reviews/repository/reviews.repository.js';

@Injectable()
export class PlacesService {
    constructor(private readonly placeRepository: PlaceRepository,
        @Inject(forwardRef(() => ReviewRepository))
        private readonly reviewRepository : ReviewRepository,
    ) { }

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

    async updatePlaceStatistics(id : string, statistics : {averageRating : number | null; reviewCount : number}) : Promise<Place> {
        const updatedPlace = await this.placeRepository.updateOnePlace(id, statistics);
        if (!updatedPlace) {
            throw new NotFoundException(`Couldn't find place with id ${id}`);
        }
        return updatedPlace;
    }
    async deleteOnePlace(id : string) : Promise<void> {
        await this.findOnePlaceById(id);

        const reviews = await this.reviewRepository.findAllReviews();
        const hasReviews = reviews.some((review) => review.placeId === id);

        if (hasReviews) {
            throw new ConflictException(`Can't delete place with ${id} because of existing reviews`);
        }
        await this.placeRepository.deleteOnePlace(id);
    }

}
