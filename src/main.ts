import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpErrorFilter } from './exception-filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const codes = errors.flatMap(err => 
        err.constraints ? Object.values(err.constraints) : []
      )
      return new BadRequestException({ codes });
    },
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  app.use(cookieParser());
  app.useGlobalFilters(new HttpErrorFilter());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
