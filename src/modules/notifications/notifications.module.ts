import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "src/modules/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotificationsService } from "./notifcations.service";
import { NotificationsController } from "./notifcations.controller";
import { NotificationsGateway } from "./notifications.gateway";
import { RedisModule } from "src/redis/redis.module";

@Module({
    imports: [
        PrismaModule,
        RedisModule,
        forwardRef(() => AuthModule)
    ],
    providers: [NotificationsService, NotificationsGateway],
    controllers: [NotificationsController],
    exports: [NotificationsService]
})
export class NotificationsModule {};