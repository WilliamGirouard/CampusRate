import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './repository/reviews.repository.js';
import { Review } from './entities/review.entity.js';
import { CreateReviewDto } from './dto/create-reviews.dto.js';
import { UpdateReviewDto } from './dto/update-reviews.dto.js';
import { PlacesService } from '../places/places.service.js';
import { ReviewResponseDto } from './dto/review-response.dto.js';
import { ReviewMapper } from './mappers/review.mapper.js';

@Injectable()
export class ReviewsService {
    constructor(private readonly reviewRepository: ReviewRepository,
        @Inject(forwardRef(() => PlacesService))
        private readonly placeService : PlacesService
    ) { }

    async findAllReview(): Promise<ReviewResponseDto[]> {
        const reviews = await this.reviewRepository.findAllReviews();
        return ReviewMapper.toResponseDtoArray(reviews);
    }

    async findOneReviewById(id: string): Promise<ReviewResponseDto> {
        const review = await this.reviewRepository.findOneReviewById(id);
        if (!review) {
            throw new NotFoundException(`Couldn't find review with id ${id}`);
        }
        return ReviewMapper.toResponseDto(review);
    }
    async findAllReviewsByPlaceId(placeId: string) : Promise<ReviewResponseDto[]> {
        await this.placeService.findOnePlaceById(placeId);
        const reviews = await this.reviewRepository.findReviewsByPlaceId(placeId);
        return ReviewMapper.toResponseDtoArray(reviews);
    }
    async createOneReview(placeId: string, dto: CreateReviewDto): Promise<ReviewResponseDto> {
        await this.placeService.findOnePlaceById(placeId);
        const newReview = {
            placeId,
            authorName: dto.authorName,
            rating: dto.rating,
            comment: dto.comment,
        };
        const created = await this.reviewRepository.createOneReview(newReview);
        await this.recalculatePlaceStatistics(placeId)
        return ReviewMapper.toResponseDto(created);
    }
    async updateOneReview(id: string, dto: UpdateReviewDto): Promise<ReviewResponseDto> {
        const review = await this.findOneReviewById(id);

        const updatedReview = await this.reviewRepository.updateOneReview(id, dto);
        if (!updatedReview) {
            throw new NotFoundException(`Couldn't find review with id ${id}`);
        }
        await this.recalculatePlaceStatistics(review.placeId)
        return ReviewMapper.toResponseDto(updatedReview);
    }
    async deleteOneReviewById(id: string): Promise<void> {
        const review = await this.findOneReviewById(id);

        const deletedReview = await this.reviewRepository.deleteOneReviewById(id);
        if (!deletedReview) {
            throw new NotFoundException(`Couldn't find review with id ${id}`);
        }
        await this.recalculatePlaceStatistics(review.placeId)
    }

    private async recalculatePlaceStatistics(placeId: string) : Promise<void> {
        const reviews = await this.reviewRepository.findReviewsByPlaceId(placeId);
        const reviewCount = reviews.length;
        if (reviewCount === 0) {
            await this.placeService.updatePlaceStatistics(placeId, {
                averageRating: null,
                reviewCount: 0,
            });
            return;
        }
        const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
        const averageRating = Number((totalRating / reviewCount).toFixed(2));
        await this.placeService.updatePlaceStatistics(placeId, {averageRating, reviewCount});
    }

}
