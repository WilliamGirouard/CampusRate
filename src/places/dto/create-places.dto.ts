import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PlaceCategoryEnum } from '../enum/place.category.enum.js';
import { PlaceStatusEnum } from '../enum/place.status.enum.js';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Significative name of the place',
    example: 'Main Library',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    description: 'Brief description of the place',
    example: 'Huge library with many books.',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  description!: string;

  @ApiProperty({
    description: "The place's category : enumerated values",
    enum: PlaceCategoryEnum,
    example: PlaceCategoryEnum.LIBRARY,
  })
  @IsEnum(PlaceCategoryEnum)
  @IsNotEmpty()
  category!: PlaceCategoryEnum;

  @ApiProperty({
    description: 'The address of the place',
    example: 'Building L, Local L-505',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  address!: string;

  @ApiProperty({
    description: "The place's services, without duplicates",
    isArray: true,
    example: ['WIFI', 'POWER_OUTLETS', 'COMPUTERS'],
    required: false,
    default: [],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  services?: string[];

  @ApiProperty({
    description: "The place's status : enumerated values",
    enum: PlaceStatusEnum,
    example: PlaceStatusEnum.ACTIVE,
    required: false,
    default: PlaceStatusEnum.ACTIVE,
  })
  @IsOptional()
  @IsEnum(PlaceStatusEnum)
  status?: PlaceStatusEnum;
}
