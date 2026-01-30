import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { FollowsService } from "./follows.service";
import { FollowsController } from "./follows.controller";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        NotificationsModule
    ],
    providers: [ FollowsService ],
    controllers: [ FollowsController ]
})
export class FollowsModule {};