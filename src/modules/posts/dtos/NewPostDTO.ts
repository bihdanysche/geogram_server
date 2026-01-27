import { IsString, MaxLength, MinLength } from "class-validator";
import { ErrorCode } from "src/exception-filter/errors.enum";

export class NewPostDTO {
    @IsString({message: ErrorCode.MUST_BE_INT})
    @MinLength(1, {message: ErrorCode.INCORRECT_CONTENT_LENGTH})
    @MaxLength(500, {message: ErrorCode.INCORRECT_CONTENT_LENGTH})
    content: string;
}