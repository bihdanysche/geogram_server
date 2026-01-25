import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { response, type Response } from "express";

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
    catch(e: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        const status = e.getStatus();
        const resp = e.getResponse();

        if (typeof resp === "object" && 'code' in response) {
            return res.status(status).json({
                code: response.code
            })
        }

        return res.status(status).json({
            code: "UNKNOWN_ERROR"
        })
    }
}