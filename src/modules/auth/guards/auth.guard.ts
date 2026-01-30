import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { Socket } from "socket.io";
import { clearAllCookies } from "src/common/helpers/cookiesHelper";
import { ErrorCode } from "src/exception-filter/errors.enum";

@Injectable()
export class AuthGuard extends PassportAuthGuard("jwt-cookie") {
    constructor(
    ) {
        super();
    }

    handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext): TUser {
        if (err || !user || info) {
            if (context.getType() === "http") {
                const response = context.switchToHttp().getResponse<Response>();
                clearAllCookies(response);
            }
            throw new UnauthorizedException({
                code: ErrorCode.INVALID_TOKEN
            });
        }
        
        return user;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const result = await super.canActivate(context);
            return result as boolean;
        } catch {
            if (context.getType() === 'ws') {
                const client = context.switchToWs().getClient<Socket>();
                client.emit('auth_error', {
                    code: 'UNAUTHORIZED',
                });
                setTimeout(() => client.disconnect(), 100);
            }
            return false;
        }
    }
}