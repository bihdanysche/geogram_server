import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { finalize } from "rxjs";
import { httpDuration } from "./http.metrics";
import type { Request, Response } from "express";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler<any>) {
        const req: Request = ctx.switchToHttp().getRequest();
        const res: Response = ctx.switchToHttp().getResponse();

        const start = process.hrtime.bigint();

        return next.handle().pipe(
            finalize(() => {
                const end = process.hrtime.bigint();
                const duration = Number(end - start) / 1e9;

                httpDuration.observe(
                    {
                        method: req.method,
                        route: req.route?.path || "unknown",
                        status: res.statusCode
                    },
                    duration
                )
            })
        )
    }
}