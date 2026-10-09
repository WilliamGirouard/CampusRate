import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {

  @ApiProperty({
    example: 1,
    description: "The current page number"
  })
  page! : number;

  @ApiProperty({ example: 25, description: "The limit of items per pages"})
  limit! : number;

  @ApiProperty({ example: 0, description: "Total count of items filtered"})
  totalItems! : number;
  
  @ApiProperty({ example: 0, description: "Total amount of pages of items filtered"})
  totalPages! : number;

}
