import { PartialType } from "@nestjs/mapped-types";
import { NewPostDTO } from "./NewPostDTO";

export class EditPostDTO extends PartialType(NewPostDTO) {};