import { Controller, Get, Header } from "@nestjs/common";
import { register } from "./registry";

@Controller()
export class MetricsController {
    @Get("/metrics")
    @Header("Content-Type", "text/plain; version=0.0.4; charset=utf-8")
    async metrics() {
        return register.metrics();
    }
}