import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {

    @ApiProperty({ example: 'rev_01JXYZ789', description: "Review ID"})
    id!: string;
    @ApiProperty({ example: 'plc_01JABC123', description: "Place ID" })
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
