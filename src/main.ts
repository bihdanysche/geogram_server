import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpErrorFilter } from './exception-filter/exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MulterExceptionFilter } from './exception-filter/multer-exception.filter';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new MulterExceptionFilter());
  app.useGlobalFilters(new HttpErrorFilter());
  app.set('trust proxy', true);
  app.enableCors({
    origin: [
      AppConfig.originURL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  });
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const codes = errors.flatMap(err => 
        err.constraints ? Object.values(err.constraints) : []
      )
      return new BadRequestException({ codes });
    },
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
