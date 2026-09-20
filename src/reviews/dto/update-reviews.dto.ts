import { PartialType } from "@nestjs/swagger";
import { CreateReviewDto } from "./create-reviews.dto.js";

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}