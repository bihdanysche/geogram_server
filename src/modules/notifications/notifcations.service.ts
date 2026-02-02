import { Inject, Injectable } from "@nestjs/common";
import { PaginationDTO } from "src/common/dtos/PaginationDTO";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationsGateway } from "./notifications.gateway";
import type { NotifcationKind } from "@prisma/client";
import Redis from "ioredis";
import { REDIS } from "src/redis/redis.module";

@Injectable()
export class NotificationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly gateway: NotificationsGateway,
        @Inject(REDIS) private readonly redis: Redis,
    ) {}

    // Controller Methods
    async getNotifications(userId: number, pagination: PaginationDTO) {
        const query = await this.prisma.notification.findMany({
            where: { userId },
            select: {
                kind: true, date: true, isChecked: true, meta: true, id: true
            },
            orderBy: { date: "desc" },
            take: pagination.take + 1,
            cursor: pagination.cursor ? { id: pagination.cursor } : undefined
        });

        let nextCursor: number|null = null;
        if (query.length > pagination.take) {
            const last = query.pop();
            nextCursor = last?.id || null;
        }

        void this.markAllAsReaded(userId);

        return {
            results: query,
            nextCursor
        }
    }

    async markAllAsReaded(userId: number) {
        await this.prisma.notification.updateMany({
            where: { userId, isChecked: false },
            data: { isChecked: true }
        });
    }

    // Push methods
    async pushFollowNotification(toUserId: number, fromUserId: number) {
        await this.pushNotification("NewFollow", toUserId, {
            usid: fromUserId
        });
    }

    async pushFriendsNotification(toUserId: number, fromUserId: number) {
        await this.pushNotification("NewFriend", toUserId, {
            usid: fromUserId
        });
    }

    async pushWelcomeNotification(toUserId: number) {
        await this.pushNotification("Welcome", toUserId);
    }

    async pushNotification(kind: NotifcationKind, userId: number, meta?: any) {
        if (!meta) {
            meta = {};
        }

        const indkey = `${kind}`;
        const vkey = `${kind}:${userId}`;
        const count = await this.redis.scard(vkey);

        if (count < 1) {
            await this.prisma.notification.create({
                data: {
                    kind: kind,
                    userId,
                    meta
                }
            });

            const roomId = this.gateway.getRoomIdForUser(userId);
            this.gateway.server.to(roomId).emit("notification", {
                kind,
                meta
            });
        }
        const pipe = this.redis.pipeline();
        pipe.sadd(vkey, meta.usid);
        pipe.sadd(indkey, userId);
        await pipe.exec();
    }
}