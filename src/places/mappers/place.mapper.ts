import { PlaceResponseDto } from "../dto/place-response.dto.js";
import { Place } from "../schemas/place.schema.js";

export class PlaceMapper {
    static toReponseDto(place: Place): PlaceResponseDto {
        return {
            id: place._id.toString(),
            name: place.name,
            description: place.description,
            category: place.category,
            address: place.address,
            services: place.services ?? [],
            status: place.status,
            averageRating: place.averageRating ?? null,
            reviewCount: place.reviewCount ?? 0,
            createdAt: place.createdAt!,
            updatedAt: place.updatedAt!,
        };
    }

    static toResponseDtoArray(places: Place[]): PlaceResponseDto[] {
        return places.map((place) => this.toReponseDto(place));
    }
}