import { Module } from "@nestjs/common";
import { AuthModule } from "src/modules/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { TestService } from "./test.service";
import { TestController } from "./test.controller";
import { RedisModule } from "src/redis/redis.module";
import { MailerModule } from "src/mailer/mailer.module";

// This module ONLY for tests.

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        RedisModule,
        MailerModule
    ],
    providers: [TestService],
    controllers: [TestController]
})
export class TestModule {};