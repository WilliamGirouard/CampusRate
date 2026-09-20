import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './repository/reviews.repository.js';
import { Review } from './entities/review.entity.js';
import { CreateReviewDto } from './dto/create-reviews.dto.js';
import { UpdateReviewDto } from './dto/update-reviews.dto.js';
import { PlacesService } from '../places/places.service.js';

@Injectable()
export class ReviewsService {
    constructor(private readonly reviewRepository: ReviewRepository,
        @Inject(forwardRef(() => PlacesService))
        private readonly placeService : PlacesService
    ) { }

    async findAllReview(): Promise<Review[]> {
        return await this.reviewRepository.findAllReviews();
    }
    async findOneReviewById(id: string): Promise<Review> {
        const review = await this.reviewRepository.findOneReviewById(id);
        if (!review) {
            throw new NotFoundException(`Couldn't find review with id ${id}`);
        }
        return review;
    }
    async findAllReviewsByPlaceId(placeId: string) : Promise<Review[]> {
        return await this.reviewRepository.findReviewsByPlaceId(placeId);
    }
    async createOneReview(placeId: string, dto: CreateReviewDto): Promise<Review> {
        await this.placeService.findOnePlaceById(placeId);

        const currentDate = new Date();
        const newReview: Review = {
            id: "rvw_" + Math.random().toString(36).slice(2, 11).toUpperCase().padEnd(9, "0"),
            placeId,
            authorName: dto.authorName,
            rating: dto.rating,
            comment: dto.comment,
            createdAt: currentDate,
            updatedAt: currentDate,
        };
        const created = await this.reviewRepository.createOneReview(newReview);
        await this.recalculatePlaceStatistics(placeId)
        return created;
    }
    async updateOneReview(id: string, dto: UpdateReviewDto): Promise<Review> {
        const review = await this.findOneReviewById(id);
        const updatedReview = await this.reviewRepository.updateOneReview(id, dto);
        if (!updatedReview) {
            throw new NotFoundException(`Couldn't find review with id ${id}`);
        }
        await this.recalculatePlaceStatistics(review.placeId)
        return updatedReview;
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
        const reviews = await this.findAllReviewsByPlaceId(placeId);
        const reviewCount = reviews.length;
        const averageRating = reviewCount === 0 ? null : reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;

        await this.placeService.updatePlaceStatistics(placeId, {averageRating, reviewCount});
    }

}
