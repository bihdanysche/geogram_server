import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "src/modules/auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { NotificationsService } from "./notifcations.service";
import { NotificationsController } from "./notifcations.controller";
import { NotificationsGateway } from "./notifications.gateway";
import { RedisModule } from "src/redis/redis.module";
import { NotificationsJobService } from "./notifications-job.service";

@Module({
    imports: [
        PrismaModule,
        RedisModule,
        forwardRef(() => AuthModule)
    ],
    providers: [NotificationsService, NotificationsGateway, NotificationsJobService],
    controllers: [NotificationsController],
    exports: [NotificationsService]
})
export class NotificationsModule {};