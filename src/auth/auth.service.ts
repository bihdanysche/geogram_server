import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDTO } from "./dtos/RegisterDTO";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { ErrorCode } from "src/exception_filter/errors.enum";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { randomUUID } from "crypto";
import { Response } from "express";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
    ) {}

    async register(dto: RegisterDTO, res: Response) {
        let user: User;
        try {
            const hash = await bcrypt.hash(dto.password, 10);
            user = await this.prisma.user.create({
                data: {
                    username: dto.username,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    password: hash
                }
            });
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError && e.code == "P2002") {
                throw new ConflictException({code: ErrorCode.USERNAME_TAKEN});
            }
            throw e;
        }

        await this.issueToken(user.id, res);
    }

    async issueToken(userId: number, res: Response) {
        const accessToken = this.jwt.sign({sub: userId});
        const refreshToken = randomUUID();
        const tokenHash = await bcrypt.hash(refreshToken, 10);

        await this.prisma.refreshToken.create({
            data: {
                userId, hash: tokenHash,
                expiresAt: new Date(Date.now() + (30 * 24 * 3600 * 1000))
            }
        })

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.mode === "production",
            maxAge: 60 * 1000,
            path: "/"
        });

         res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.mode === "production",
            maxAge: 60 * 1000,
            path: "/auth"
        });
    }
}