import { Module } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = 'REDIS';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST!,
          port: parseInt(process.env.REDIS_PORT!),
        });
      },
    },
  ],
  exports: [REDIS],
})

export class RedisModule {}