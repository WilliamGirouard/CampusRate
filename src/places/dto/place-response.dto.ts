import { ApiProperty } from '@nestjs/swagger';
import { PlaceCategoryEnum } from '../enum/place.category.enum.js';
import { PlaceStatusEnum } from '../enum/place.status.enum.js';

export class PlaceResponseDto {
  @ApiProperty({ example: 'plc_01JABC123' })
  id!: string;

  @ApiProperty({ example: 'Main Library' })
  name!: string;

  @ApiProperty({ example: 'Huge library with many books.' })
  description!: string;

  @ApiProperty({ enum: PlaceCategoryEnum, example: PlaceCategoryEnum.LIBRARY })
  category!: PlaceCategoryEnum;

  @ApiProperty({ example: 'Building L, Local-L505' })
  address!: string;

  @ApiProperty({
    isArray: true,
    example: ['WIFI', 'POWER_OUTLETS', 'COMPUTERS'],
  })
  services!: string[];

  @ApiProperty({
    enum: PlaceStatusEnum,
    example: PlaceStatusEnum.ACTIVE,
  })
  status!: PlaceStatusEnum;

  @ApiProperty({
    example: 4.75,
    nullable: true,
    description: "If no review, then null, if review, then average rating"
  })
  averageRating! : number | null;

  @ApiProperty({ example: 1, description: "There is 1 review, 0 if no review"})
  reviewCount ! : number;

  @ApiProperty({format: "date-time"})
  createdAt! : Date;
  
  @ApiProperty({format: "date-time"})
  updatedAt! : Date;


}
