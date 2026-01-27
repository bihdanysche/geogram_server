import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { ErrorCode } from "src/exception-filter/errors.enum";

export class PaginationDTO {
    @IsInt({message: ErrorCode.MUST_BE_INT})
    @IsOptional()
    @Type(() => Number)
    cursor?: number;

    @IsInt({message: ErrorCode.MUST_BE_INT})
    @Min(1, {message: ErrorCode.INVALID_TAKE_VALUE})
    @Max(15, {message: ErrorCode.INVALID_TAKE_VALUE})
    @Type(() => Number)
    take: number = 10;
}