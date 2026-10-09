import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";


@Schema({ timestamps: true })
export class Review extends Document {

    @Prop({ type: SchemaTypes.ObjectId, ref: "Place", required: true })
    placeId: string
    @Prop({ required: true, trim: true, maxLength: 50 })
    authorName: string
    @Prop({ trequired: true, min: 1, max: 5, type: Number })
    rating: number
    @Prop({ required: true, minLength: 25, maxLength: 100 })
    comment: string
    @Prop({ default: null })
    createdAt?: Date
    @Prop({ default: null })
    updatedAt?: Date
}

export const ReviewSchema = SchemaFactory.createForClass(Review);