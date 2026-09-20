import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { PlacesService } from './places.service.js';
import { CreatePlaceDto } from './dto/create-places.dto.js';
import type { Response } from 'express';
import { UpdatePlaceDto } from './dto/update-places.dto.js';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PlaceResponseDto } from './dto/place-response.dto.js';
import { ProblemDetailsDto } from '../common/dtos/problem-details.dto.js';
import { PaginationFilteringQueryDto } from './dto/pagination-filtering-query.dto.js';
import { QueriedPlacesResponseDto } from './dto/queried-places-response.dto.js';

@ApiTags("Places")
@Controller({ path: 'places', version: "1" })
export class PlacesController {

    constructor(private readonly placesService: PlacesService) { }

    @Get()
    @ApiOperation({
        summary: "List places",
        description: "Return the collection of places filtered and paginated"
    })
    @ApiOkResponse({ description: "Paginated list of places", type: QueriedPlacesResponseDto })
    @ApiBadRequestResponse({ description: "Invalid category, page or limit", type: ProblemDetailsDto })
    async findAllPlaces(@Query() dto: PaginationFilteringQueryDto) : Promise<QueriedPlacesResponseDto>{
        return this.placesService.findAllPlace(dto);
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get info on one place",
        description: "Returns one place by given id"
    })
    @ApiParam({ name: "id", description: "The place's ID", example: "plc_01JABC123" })
    @ApiOkResponse({ description: "Place found", type: PlaceResponseDto })
    @ApiNotFoundResponse({ description: "Place not found", type: ProblemDetailsDto })
    async findOnePlaceById(@Param("id") id: string) {
        return this.placesService.findOnePlaceById(id);
    }

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: "Create a place",
        description: "Create a new place and add it to the list of places"
    })
    @ApiCreatedResponse({
        description: "Place has been created",
        type: PlaceResponseDto,
        headers: {
            Location: {
                description: "URI of the created Place",
                schema: { type: "string" },
            }
        }
    })
    @ApiBadRequestResponse({ description: "Invalid data", type: ProblemDetailsDto })
    @ApiBody({ type: CreatePlaceDto })
    async createOnePlace(@Body() dto: CreatePlaceDto, @Res({ passthrough: true }) response: Response) {
        const createdPlace = await this.placesService.createOnePlace(dto);
        response.setHeader("Location", `/api/v1/places/${createdPlace.id}`);
        return createdPlace;
    }

    @Patch(":id")
    @ApiOperation({
        summary: "Update a place",
        description: "Partially update an existing place"
    })
    @ApiParam({ name: "id", description: "The place's ID", example: "plc_01JABC123" })
    @ApiOkResponse({ description: "Place modified", type: PlaceResponseDto })
    @ApiBadRequestResponse({
        description: "Invalid data",
        type: ProblemDetailsDto
    })
    @ApiNotFoundResponse({
        description: "Place not found",
        type: ProblemDetailsDto
    })
    @ApiBody({ type: UpdatePlaceDto })
    async updateOnePlace(@Param("id") id: string, @Body() dto: UpdatePlaceDto) {
        return this.placesService.updateOnePlace(id, dto);
    }

    @Delete(":id")
    @HttpCode(204)
    @ApiOperation({
        summary: "Delete a place",
        description: "Delete an existing place that has no reviews"
    })
    @ApiParam({ name: "id", description: "The place's ID", example: "plc_01JABC123" })
    @ApiNoContentResponse({ description: "Place deleted" })
    @ApiConflictResponse({
        description: "The place you want to delete has reviews, thus it cannot be deleted",
        type: ProblemDetailsDto
    })
    @ApiNotFoundResponse({
        description: "Place not found",
        type: ProblemDetailsDto
    })
    async deleteOnePlaceById(@Param("id") id: string): Promise<void> {
        await this.placesService.deleteOnePlaceById(id);
    }
}
