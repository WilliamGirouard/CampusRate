import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {

  @ApiProperty({
    description: "The reviewer's name",
    example: 'William',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  authorName!: string;

  @ApiProperty({
    description: "The given rating of the place by the reviewer",
    example: 4,
    minimum: 1,
    maximum: 5
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @ApiProperty({
    description: 'Comment on the place',
    example: 'Great Wi-fi, nice environnment',
    maxLength: 100,
    minLength: 25,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(25)
  comment!: string;
}
