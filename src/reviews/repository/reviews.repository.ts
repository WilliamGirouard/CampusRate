import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Review } from "../schemas/review.schema.js";
import { Model, Types } from "mongoose";

@Injectable()
export class ReviewRepository {

    constructor(@InjectModel(Review.name) private readonly reviewModel : Model<Review>) { }

    async findAllReviews(): Promise<Review[]> {
        return this.reviewModel.find().exec();
    }
    async findOneReviewById(id: string): Promise<Review | null> {
        return this.reviewModel.findById(id).exec();
    }
    async findReviewsByPlaceId(placeId : string) : Promise<Review[]> {
        return this.reviewModel.find({placeId}).exec();
    }
    async createOneReview(review: Partial<Review>): Promise<Review> {
        const newReview = new this.reviewModel(review);
        return newReview.save();
    }
    async updateOneReview(id: string, attr: Partial<Review>): Promise<Review | null> {
        return this.reviewModel.findByIdAndUpdate(id, attr, {returnDocument : "after"}).exec();
    }

    async deleteOneReviewById(id: string): Promise<boolean> {
        const result = await this.reviewModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
}