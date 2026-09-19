import { Injectable } from "@nestjs/common";
import { StorageService } from "../../storage/storage.service.js";
import { Place } from "../entities/place.entity.js";

@Injectable()
export class PlaceRepository {

    constructor(private readonly storageService: StorageService) { }

    async findAllPlaces(): Promise<Place[]> {
        const storedData = await this.storageService.readJSONFile();
        return storedData.places as Place[];
    }
    async findOnePlaceById(id: string): Promise<Place | null> {
        const places = await this.findAllPlaces();
        return places.find((place) => place.id === id) ?? null;
    }
    async createOnePlace(place: Place): Promise<Place> {
        const storedData = await this.storageService.readJSONFile();
        const places = storedData.places as Place[];
        places.push(place);
        await this.storageService.writeJSONFile(storedData);
        return place;
    }
    async updateOnePlace(id: string, attr: Partial<Place>): Promise<Place | null> {
        const storedData = await this.storageService.readJSONFile();
        const places = storedData.places as Place[];
        const index = places.findIndex((place: any) => place.id === id);
        if (index === -1) {
            return null;
        }
        places[index] = { ...places[index], ...attr, updatedAt: new Date() };
        await this.storageService.writeJSONFile(storedData);
        return places[index];
    }

    async deleteOnePlace(id: string): Promise<boolean> {
        const storedData = await this.storageService.readJSONFile();
        const places = storedData.places as Place[];
        const index = places.findIndex((place) => place.id === id);
        if (index === -1) {
            return false;
        }
        places.splice(index, 1);
        await this.storageService.writeJSONFile(storedData);
        return true;
    }
}