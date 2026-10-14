import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {

    @ApiProperty({ example: '6ac9454abb6cc8366ddd350c', description: "Review ID"})
    id!: string;
    @ApiProperty({ example: '6ac9454abb6cc8366ddd450c', description: "Place ID" })
    placeId!: string;

    @ApiProperty({ example: 'William' })
    authorName!: string;

    @ApiProperty({
        example: 4,
        minimum: 1,
        maximum: 5
    })
    rating!: number;

    @ApiProperty({ example: 'Great Wi-fi, nice environnment' })
    comment!: string;

    @ApiProperty({ format: "date-time" })
    createdAt!: Date;

    @ApiProperty({ format: "date-time" })
    updatedAt!: Date;
}
