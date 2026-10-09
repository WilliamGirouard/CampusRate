import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PlaceCategoryEnum } from "../enum/place.category.enum.js";
import { PlaceStatusEnum } from "../enum/place.status.enum.js";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Place extends Document {
    @Prop({required: true, trim: true, maxLength: 50})
    name : string;

    @Prop({required: true, maxLength: 100})
    description: string;

    @Prop({required: true, enum: PlaceCategoryEnum, type:String})
    category: PlaceCategoryEnum;

    @Prop({required: true, maxLength: 100})
    address: string;

    @Prop({type: [String], default: []})
    services: string[];

    @Prop({required: true, enum: PlaceStatusEnum, type:String, default: PlaceStatusEnum.ACTIVE})
    status: PlaceStatusEnum;

    @Prop({default: null})
    averageRating: number | null;

    @Prop({default: 0})
    reviewCount: number;

    @Prop({default: null})
    createdAt? : Date;

    @Prop({default: null})
    updatedAt?: Date;
}
export const PlaceShema = SchemaFactory.createForClass(Place);