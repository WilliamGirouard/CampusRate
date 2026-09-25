import { ApiProperty } from "@nestjs/swagger";
import { PlaceCategoryEnum } from "../enum/place.category.enum.js";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationFilteringQueryDto {
    @ApiProperty({
        description: 'Place Category filter',
        enum : PlaceCategoryEnum,
        example: PlaceCategoryEnum.STUDY_SPACE
      })
    @IsEnum(PlaceCategoryEnum)
    @IsOptional()
    category?: PlaceCategoryEnum

    @ApiProperty({
        description: 'Place pagination number (Current page number)',
        example: 3,
        default: 1,
        required: false
    })
    @IsInt()
    @Min(1)
    @Type(() => Number)
    @IsOptional()
    page: number = 1

    @ApiProperty({
        description: 'The limit of places per pages (how many places per page)',
        example: 5,
        maximum : 25,
        minimum : 1,
        default: 10,
        required: false
    })
    @Max(25)
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    limit: number = 10;
}