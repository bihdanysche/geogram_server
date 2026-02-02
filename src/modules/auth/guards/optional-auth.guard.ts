import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

@Injectable()
export class OptionalAuthGuard extends AuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        let rawCookie: string|null = null;

        if (context.getType() === "http") {
            const cook = context.switchToHttp().getRequest().cookies?.access_token;
            if (cook) {
                rawCookie = cook;
            }
        } else if (context.getType() === "ws") {
            const cook = context.switchToWs().getClient().handshake.headers.cookie;

            if (cook) {
                rawCookie = cook;
            }  
        }
        
        if (rawCookie) {
            return await super.canActivate(context);
        }

        return true;
    }

    handleRequest(err, user) {
        if (err || !user) {
            return null;
        }

        return user;
    }
}