import * as prom from "prom-client";
import { register } from "./registry";

export const httpDuration = new prom.Histogram({
    name: "http_request_duration_secods",
    help: "HTTP request latency",
    labelNames: ["method", "route", "status"],
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

register.registerMetric(httpDuration);