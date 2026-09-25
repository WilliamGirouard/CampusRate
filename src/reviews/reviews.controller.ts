import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service.js';
import { ReviewResponseDto } from './dto/review-response.dto.js';
import { ProblemDetailsDto } from '../common/dtos/problem-details.dto.js';
import { UpdateReviewDto } from './dto/update-reviews.dto.js';
import { CreateReviewDto } from './dto/create-reviews.dto.js';
import type { Response } from 'express';

@ApiTags("Reviews")
@Controller({ version: "1"})
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get("reviews/:id")
    @ApiOperation({
        summary: "Get info on one review",
        description : "Returns one review by given id"
    })
    @ApiParam({name: "id", description: "The review's ID", example: "rvw_01JABC123"})
    @ApiOkResponse({description : "Review found", type: ReviewResponseDto })
    @ApiNotFoundResponse({description: "Review not found", type: ProblemDetailsDto })
    async findOneReviewById(@Param("id") id : string) {
        return this.reviewsService.findOneReviewById(id);
    }

    @Patch("reviews/:id")
    @ApiOperation({
        summary: "Update a review",
        description: "Partially update an existing review and recalculate the statistics"
    })
    @ApiParam({name: "id", description: "The reviews's ID", example: "rvw_01JABC123"})
    @ApiOkResponse({ description: "Review modified", type : ReviewResponseDto})
    @ApiBadRequestResponse({
        description: "Invalid data",
        type: ProblemDetailsDto
    })
    @ApiNotFoundResponse({
        description: "Review not found",
        type: ProblemDetailsDto
    })
    @ApiBody({type: UpdateReviewDto})
    async updateOneReview(@Param("id") id : string, @Body() dto: UpdateReviewDto) {
        return this.reviewsService.updateOneReview(id, dto);
    }

    @Delete("reviews/:id")
    @HttpCode(204)
    @ApiOperation({
        summary: "Delete a review",
        description: "Delete an existing review and recalculate the statistics"
    })
    @ApiParam({name: "id", description: "The review's ID", example: "rvw_01JABC123"})
    @ApiNoContentResponse({description: "Review deleted"})
    @ApiNotFoundResponse({
        description: "Review not found",
        type: ProblemDetailsDto
    })
    async deleteOneReviewById(@Param("id") id : string) : Promise<void> {
        await this.reviewsService.deleteOneReviewById(id);
    }

    @Get("places/:placeId/reviews")
    @ApiOperation({
        summary: "List reviews for a place",
        description: "Returns all reviews linked to given place"
    })
    @ApiParam({name : "placeId", description: "The place's ID", example: "plc_01JABC123"})
    @ApiOkResponse({ description: "List of reviews", type: [ReviewResponseDto]})
    async findAllReviewsByPlaceId(@Param("placeId") placeId : string) {
        return this.reviewsService.findAllReviewsByPlaceId(placeId);
    }

    @Post("places/:placeId/reviews")
    @HttpCode(201)
    @ApiOperation({
         summary: "Create a review for one place",
        description: "Create a review for an existing place and recalculate the statistics"
    })
    @ApiParam({name : "placeId", description: "The place's ID", example: "plc_01JABC123"})
    @ApiCreatedResponse({
            description: "Review has been created",
            type : ReviewResponseDto,
            headers: {
                Location : {
                    description: "URI of the created review",
                    schema: {type : "string"},
                }
            }
        })
        @ApiBadRequestResponse({ description: "Invalid data", type: ProblemDetailsDto })
        @ApiNotFoundResponse({ description: "Place not found", type: ProblemDetailsDto })
        @ApiBody({type : CreateReviewDto})
        async createOneReview(@Param("placeId") placeId: string, @Body() dto : CreateReviewDto, @Res({passthrough : true}) response: Response) {
            const createdReview = await this.reviewsService.createOneReview(placeId, dto);
            response.setHeader("Location", `/api/v1/reviews/${createdReview.id}`);
            return createdReview;
        }
}
