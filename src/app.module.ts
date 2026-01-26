import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

const JWT_AGE = parseInt(process.env.ACCESS_TOKEN_AGE || "60000");

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: JWT_AGE }
    }),
    PrismaModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}