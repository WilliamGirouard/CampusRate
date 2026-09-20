import { Body, Controller, Delete, Get, HttpCode, Param, Patch } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service.js';
import { ReviewResponseDto } from './dto/ReviewResponseDto.js';
import { ProblemDetailsDto } from '../common/dtos/problem-details.dto.js';
import { UpdateReviewDto } from './dto/update-reviews.dto.js';

@ApiTags("Reviews")
@Controller({path: 'reviews', version: "1"})
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get(":id")
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

    @Patch(":id")
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

    @Delete(":id")
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
}
