import { Injectable, NotFoundException } from "@nestjs/common";
import { ErrorCode } from "src/exception-filter/errors.enum";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService
    ) {};

    async me(userId: number) {
        return await this.prisma.user.findUnique({
            where: {id: userId},
            omit: {
                password: true
            }
        });
    }

    async getByUsername(username: string) {
        const us = await this.prisma.user.findUnique({
            where: { username },
            omit: {
                password: true
            }
        });
        
        if (!us) {
            throw new NotFoundException({
                code: ErrorCode.NOT_EXISTING_USER
            })
        }

        return us;
    }

    async getById(id: number) {
        const us = await this.prisma.user.findUnique({
            where: { id },
            omit: {
                password: true
            }
        });

        if (!us) {
            throw new NotFoundException({
                code: ErrorCode.NOT_EXISTING_USER
            })
        }

        return us;
    }

    async allUsers() {
        return await this.prisma.user.findMany({});
    }
}