import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { clearAllCookies } from "src/common/helpers/cookiesHelper";
import { ErrorCode } from "src/exception-filter/errors.enum";

@Injectable()
export class AuthGuard extends PassportAuthGuard("jwt-cookie") {
    constructor(
    ) {
        super();
    }

    handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext): TUser {
        const response = context.switchToHttp().getResponse<Response>();
        
        if (err || !user || info) {
            clearAllCookies(response);
            throw new UnauthorizedException({
                code: ErrorCode.INVALID_TOKEN
            });
        }
        
        return user;
    }
}