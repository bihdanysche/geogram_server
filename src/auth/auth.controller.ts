import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO } from "./dtos/RegisterDTO";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly auth: AuthService
    ) {};

    @Post("register")
    async register(@Body() dto: RegisterDTO, @Res() res: Response) {
        return await this.auth.register(dto, res);
    }
}