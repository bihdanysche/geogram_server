import { Global, Module } from "@nestjs/common";
import { MetricsController } from "./metrics.controller";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MetricsInterceptor } from "./metrics.interceptor";

@Global()
@Module({
    controllers: [MetricsController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: MetricsInterceptor
        }
    ]
})
export class MetricsModule {};