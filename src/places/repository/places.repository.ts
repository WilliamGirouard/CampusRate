import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Place } from "../schemas/place.schema.js";
import { Model } from "mongoose";

@Injectable()
export class PlaceRepository {

    constructor(@InjectModel(Place.name) private readonly placeModel: Model<Place>) { }

    async findAllPlaces(): Promise<Place[]> {
        return this.placeModel.find().exec();
    }
    async findOnePlaceById(id: string): Promise<Place | null> {
        return this.placeModel.findById(id).exec();
    }
    async createOnePlace(place: Partial<Place>): Promise<Place> {
        const newPlace = new this.placeModel(place);
        return newPlace.save();
    }
    async updateOnePlace(id: string, attr: Partial<Place>): Promise<Place | null> {
        return this.placeModel.findByIdAndUpdate(id, attr, {new: true}).exec();
    }

    async deleteOnePlaceById(id: string): Promise<boolean> {
        const result = await this.placeModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
}