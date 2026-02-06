import * as prom from "prom-client";

export const register = new prom.Registry();

prom.collectDefaultMetrics({
    register,
    prefix: "nest_"
})