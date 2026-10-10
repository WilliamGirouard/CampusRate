import { ConflictException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './repository/places.repository.js';
import { CreatePlaceDto } from './dto/create-places.dto.js';
import { PlaceStatusEnum } from './enum/place.status.enum.js';
import { UpdatePlaceDto } from './dto/update-places.dto.js';
import { ReviewRepository } from '../reviews/repository/reviews.repository.js';
import { PaginationFilteringQueryDto } from './dto/pagination-filtering-query.dto.js';
import { QueriedPlacesResponseDto } from './dto/queried-places-response.dto.js';
import { PlaceMapper } from './mappers/place.mapper.js';
import { PlaceResponseDto } from './dto/place-response.dto.js';

@Injectable()
export class PlacesService {
    constructor(private readonly placeRepository: PlaceRepository,
        @Inject(forwardRef(() => ReviewRepository))
        private readonly reviewRepository: ReviewRepository,
    ) { }

    async findAllPlace(dto: PaginationFilteringQueryDto): Promise<QueriedPlacesResponseDto> {
        const places = await this.placeRepository.findAllPlaces();
        const filteredPlacesByCategory = dto.category ? places.filter((place) => place.category === dto.category) : places;
        const start = (dto.page - 1) * dto.limit;
        const correctPagePlaces = filteredPlacesByCategory.slice(start, start + dto.limit);
        const totalItems = filteredPlacesByCategory.length;
        const totalPages = Math.ceil(totalItems / dto.limit);

        return {
            data: PlaceMapper.toResponseDtoArray(correctPagePlaces),
            pagination: {
                page: dto.page,
                limit: dto.limit,
                totalItems,
                totalPages,
            }
        }
    }
    async findOnePlaceById(id: string): Promise<PlaceResponseDto> {
        const place = await this.placeRepository.findOnePlaceById(id);
        if (!place) {
            throw new NotFoundException(`Couldn't find place with id ${id}`);
        }
        return PlaceMapper.toReponseDto(place);
    }
    async createOnePlace(dto: CreatePlaceDto): Promise<PlaceResponseDto> {
        try {
            const newPlace = {
                name: dto.name,
                description: dto.description,
                category: dto.category,
                address: dto.address,
                services: dto.services ?? [],
                status: dto.status ?? PlaceStatusEnum.ACTIVE,
                averageRating: null,
                reviewCount: 0,
            };
            const createdPlace = await this.placeRepository.createOnePlace(newPlace);
            return PlaceMapper.toReponseDto(createdPlace);
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException("A place with this name already exists.")
            }
            throw error;
        }

    }
    async updateOnePlace(id: string, dto: UpdatePlaceDto): Promise<PlaceResponseDto> {
        const updatedPlace = await this.placeRepository.updateOnePlace(id, dto);
        if (!updatedPlace) {
            throw new NotFoundException(`Couldn't find place with id ${id}`);
        }
        return PlaceMapper.toReponseDto(updatedPlace);
    }

    async updatePlaceStatistics(id: string, statistics: { averageRating: number | null; reviewCount: number }): Promise<PlaceResponseDto> {
        const updatedPlace = await this.placeRepository.updateOnePlace(id, statistics);
        if (!updatedPlace) {
            throw new NotFoundException(`Couldn't find place with id ${id}`);
        }
        return PlaceMapper.toReponseDto(updatedPlace);
    }
    async deleteOnePlaceById(id: string): Promise<void> {
        await this.findOnePlaceById(id);

        const reviews = await this.reviewRepository.findReviewsByPlaceId(id);

        if (reviews.length > 0) {
            throw new ConflictException(`Can't delete place with ${id} because of existing reviews`);
        }
        await this.placeRepository.deleteOnePlaceById(id);
    }

}
