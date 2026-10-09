import { PartialType } from "@nestjs/swagger";
import { CreatePlaceDto } from "./create-places.dto.js";

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {}