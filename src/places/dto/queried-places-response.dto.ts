import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "../../common/dtos/pagination.dto.js";
import { PlaceResponseDto } from "./place-response.dto.js";


export class QueriedPlacesResponseDto {

    @ApiProperty({
        description: "The filtered places's data",
        type: [PlaceResponseDto]
    })
    data: PlaceResponseDto[];

    @ApiProperty({
        description: "The queried information",
        type: PaginationDto
    })
    pagination: PaginationDto;
}