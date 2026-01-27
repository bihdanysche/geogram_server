import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { PrismaService } from "src/prisma/prisma.service";
import { REDIS } from "src/redis/redis.module";

@Injectable()
export class TestService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(REDIS) private readonly redis: Redis,
        private readonly mailerService: MailerService
    ) {};

    async refreshTokens() {
        return await this.redis.get("val")
    }

    async newreftoken() {
        await this.mailerService.sendMail({
            to: "ma5400026@gmail.com",
            subject: "subj",
            template: "confirm",
            context: {
                name: "idiot"
            }
        })
        // await this.mailerService.sendMail({
        //     to: "ma5400026@gmail.com",
        //     subject: "subj",
        //     text: "txt",
        //     html: "hhh <b>mmm</b>"
        // })
        // return await this.redis.set("val", 5, "EX", 20);
    }

//    hash(code: string) {
//   return crypto.createHash('sha256').update(code).digest('hex');
// }
// const token = crypto.randomBytes(32).toString('hex');
}