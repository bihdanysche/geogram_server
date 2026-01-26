import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dtos/RegisterDTO";
import type { Request, Response } from "express";
import { NoAuthGuard } from "./guards/no-auth.guard";
import { LoginDTO } from "./dtos/LoginDTO";
import { AuthGuard } from "./guards/auth.guard";
import { UserId } from "./decorators/user-id.decorator";
import { ErrorCode } from "src/exception-filter/errors.enum";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly auth: AuthService
    ) {};

    @Post("register")
    @UseGuards(NoAuthGuard)
    async register(@Body() dto: RegisterDTO, @Res() res: Response) {
        await this.auth.register(dto, res);
        res.status(HttpStatus.NO_CONTENT).end();
    }

    @Post("login")
    @UseGuards(NoAuthGuard)
    async login(@Body() dto: LoginDTO, @Res() res: Response) {
        await this.auth.login(dto, res);
        res.status(HttpStatus.NO_CONTENT).end();
    }

    @Post("refresh-token")
    async refresh(@Req() req: Request, @Res() res: Response) {
        if (!req.cookies.refresh_token) {
            throw new UnauthorizedException({code: ErrorCode.REFRESH_TOKEN_INVALID})
        }
        await this.auth.rotateRefreshToken(req, res);
        res.status(HttpStatus.NO_CONTENT).end();
    }

    @Post("logout")
    @UseGuards(AuthGuard)
    async logout(@Req() req: Request, @Res() res: Response) {
        await this.auth.logout(req, res);
        res.status(HttpStatus.NO_CONTENT).end();
    }

    @Post("logout-other-sessions")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AuthGuard)
    async logoutOtherSessions(@UserId() usId: number, @Req() req: Request) {
        await this.auth.logoutOtherSessions(usId, req);
    }

    @Get("/check")
    @UseGuards(AuthGuard)
    check(@UserId() usId: number) {
        return `Hi, ${usId}!`;
    }
}