import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { Strategy } from "passport-jwt";
import { Socket } from "socket.io";
import { ErrorCode } from "src/exception-filter/errors.enum";
import { PrismaService } from "src/prisma/prisma.service";
import * as cookie from "cookie";

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, "jwt-cookie") {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: (req: Request) => {
                if (req instanceof Socket) {
                    return this.extractFromWs(req);
                }

                return this.extractFromHttp(req);
            },
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET!,
            passReqToCallback: true
        });
    }

    extractFromWs(client: Socket) {
        const rawCookie = client.handshake.headers.cookie;

        if (!rawCookie) {
            throw new UnauthorizedException({
                code: ErrorCode.INVALID_TOKEN
            });
        }
        
        const cookies = cookie.parse(rawCookie);
        const accessToken = cookies['access_token'];

        if (!accessToken) {
            throw new UnauthorizedException({
                code: ErrorCode.INVALID_TOKEN
            });
        }

        return accessToken;
    }

    extractFromHttp(req: Request) {
        const tok = req.cookies?.access_token as string;

        if (!tok) {
            throw new UnauthorizedException({
                code: ErrorCode.INVALID_TOKEN
            });
        }

        return tok;
    }

    async validate(req: any, payload: { sessionId: number }): Promise<Express.User> {
        const session = await this.prismaService.refreshToken.findUnique({
            where: {id: payload.sessionId},
            select: {userId: true}
        });

        if (!session) {
            throw new UnauthorizedException({
                code: ErrorCode.INVALID_TOKEN
            })
        }
        
        const data = { userId: session.userId, sessionId: payload.sessionId };
        
        if (req instanceof Socket) {
            req.data = {...data, ...req.data};
        }

        return data;
    }
}