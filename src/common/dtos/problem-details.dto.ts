import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

    export class ProblemDetailsDto {
        
      @ApiProperty({ example: 'about:blank' })
      type!: string;

      @ApiProperty({ example: 'Bad Request' })
      title!: string;

      @ApiProperty({ example: 400 })
      status!: number;

      @ApiProperty({
        example: 'The request has invalid data.',
      })
      detail!: string;

      @ApiProperty({ example: '/api/v1/places' })
      instance!: string;

      @ApiPropertyOptional({
        type: [String],
        example: ['The name is required.'],
      })
      errors?: string[];
    }