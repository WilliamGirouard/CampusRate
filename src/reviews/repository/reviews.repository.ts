import { Injectable } from "@nestjs/common";
import { StorageService } from "../../storage/storage.service.js";
import { Review } from "../entities/review.entity.js";

@Injectable()
export class ReviewRepository {

    constructor(private readonly storageService: StorageService) { }

    async findAllReviews(): Promise<Review[]> {
        const storedData = await this.storageService.readJSONFile();
        return storedData.reviews as Review[];
    }
    async findOneReviewById(id: string): Promise<Review | null> {
        const reviews = await this.findAllReviews();
        return reviews.find((review) => review.id === id) ?? null;
    }
    async findReviewsByPlaceId(placeId : string) : Promise<Review[]> {
        const reviews = await this.findAllReviews();
        return reviews.filter((review) => review.placeId === placeId);
    }
    async createOneReview(review: Review): Promise<Review> {
        const storedData = await this.storageService.readJSONFile();
        const reviews = storedData.reviews as Review[];
        reviews.push(review);
        await this.storageService.writeJSONFile(storedData);
        return review;
    }
    async updateOneReview(id: string, attr: Partial<Review>): Promise<Review | null> {
        const storedData = await this.storageService.readJSONFile();
        const reviews = storedData.reviews as Review[];
        const index = reviews.findIndex((review) => review.id === id);
        if (index === -1) {
            return null;
        }
        reviews[index] = { ...reviews[index], ...attr, updatedAt: new Date() };
        await this.storageService.writeJSONFile(storedData);
        return reviews[index];
    }

    async deleteOneReviewById(id: string): Promise<boolean> {
        const storedData = await this.storageService.readJSONFile();
        const reviews = storedData.reviews as Review[];
        const index = reviews.findIndex((review) => review.id === id);
        if (index === -1) {
            return false;
        }
        reviews.splice(index, 1);
        await this.storageService.writeJSONFile(storedData);
        return true;
    }
}