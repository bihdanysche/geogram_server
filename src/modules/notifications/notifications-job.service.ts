import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import Redis from "ioredis";
import { PrismaService } from "src/prisma/prisma.service";
import { REDIS } from "src/redis/redis.module";
import type { NotificationKind, PrismaPromise } from "@prisma/client";
import { NotificationsGateway } from "./notifications.gateway";

const KINDS = [
    "NewFollow", "NewFriend",
    "LikedPost", "LikedComment",
    "CommentedPost", "CommentedComment",
];
const BATCH_SIZE = 100;

@Injectable()
export class NotificationsJobService {
    private readonly logger = new Logger(NotificationsJobService.name);

    constructor(
        private readonly prisma: PrismaService,
        @Inject(REDIS) private readonly redis: Redis,
        private readonly gateway: NotificationsGateway,
    ) {}
    
    @Cron("* * * * *")
    async aggregateNotifs() {
        const t = Date.now();

        await Promise.all(KINDS.map(kind => this.proccessKind(kind)));
        
        this.logger.log(`Notifications agg job finished in ${(Date.now()-t)/1000}s.`);
    }

    async proccessKind(kind: string) {
        const hourAgo = new Date(Date.now() - 3600 * 1000);

        const ids = await this.redis.spop(kind, BATCH_SIZE);
        if (ids.length === 0) {
            return;
        }

        const pipe = this.redis.pipeline();

        for (const userId of ids) {
            const vkey = `${kind}:${userId}`;
            pipe.scard(vkey);
            pipe.srandmember(vkey);
            pipe.del(vkey);
        }
        
        const results = await pipe.exec();
        if (!results) {
            return;
        }

        const prismaOps: PrismaPromise<any>[] = [];
        const gatewayEvents: {userId: number, data: any}[] = [];

        for (let i = 0; i < ids.length; i++) {
            const userId = Number(ids[i]);
            const totalCount = Number(results[i*3][1] ?? 0);
            const randId = Number(results[i*3+1][1] ?? 0);

            if (totalCount === 0) continue;

            const meta = {
                usid: randId,
                count: totalCount - 1
            };

            prismaOps.push(
                this.prisma.notification.deleteMany({
                    where: {
                        kind: kind as NotificationKind,
                        userId,
                        date: {
                            gte: hourAgo
                        }
                    }
                })
            );
            prismaOps.push(
                this.prisma.notification.create({
                    data: {
                        kind: kind as NotificationKind,
                        userId,
                        meta,
                    }
                })
            );

            gatewayEvents.push({
                userId, data: { kind, meta }
            })
        }

        if (prismaOps.length > 0) {
            await this.prisma.$transaction(prismaOps);

            gatewayEvents.forEach(ev => {
                this.gateway.server
                    .to(this.gateway.getRoomIdForUser(ev.userId))
                    .emit("notification", ev.data);
            })
        }
    }
}