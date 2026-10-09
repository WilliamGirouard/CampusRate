import { ReviewResponseDto } from "../dto/review-response.dto.js";
import { Review } from "../schemas/review.schema.js";

export class ReviewMapper {
    static toResponseDto(review: Review): ReviewResponseDto {
        return {
            id: review._id.toString(),
            placeId: review.placeId.toString(),
            authorName: review.authorName,
            rating: Number(review.rating),
            comment: review.comment,
            createdAt: review.createdAt!,
            updatedAt: review.updatedAt!,
        };
    }

    static toResponseDtoArray(reviews: Review[]): ReviewResponseDto[] {
        return reviews.map((review) => this.toResponseDto(review));
    }
}