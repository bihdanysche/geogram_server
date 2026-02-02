import { MailerService } from "@nestjs-modules/mailer";
import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { PrismaService } from "src/prisma/prisma.service";
import { REDIS } from "src/redis/redis.module";

import { faker } from '@faker-js/faker/locale/uk'
// import * as bcrypt from "bcrypt";

const BATCH_SIZE = 5000
const TOTAL = 1_000_000

async function run(prisma: PrismaService) {
    console.log("Start batch")
    // const pswrd = await bcrypt.hash("soso", 10);

  for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
    const users: any[] = []
    const us = await prisma.user.findMany({
        take: BATCH_SIZE/10,
        skip: Math.floor(Math.random() * TOTAL/2)
    });
    for (let j = 0; j < BATCH_SIZE; j++) {
      users.push({
            content: faker.lorem.text(),
            authorId: us[Math.floor(Math.random() * us.length)].id
      })
    }

    // await prisma.user.createMany({
    //   data: users,
    //   skipDuplicates: true
    // })
    await prisma.post.createMany({
        data: users,
        skipDuplicates: true
    })

    console.log(`Inserted ${i + BATCH_SIZE}`)
  }

  console.log("stop batch")
}

@Injectable()
export class TestService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject(REDIS) private readonly redis: Redis,
        private readonly mailerService: MailerService
    ) {
        /*
        286290
193573
191193
 */
        // void run(this.prisma);
    };

    refreshTokens() {
        void run(this.prisma);
        return {started: true}
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