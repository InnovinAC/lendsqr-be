import {HealthRoutes} from "@/routes/health.route";
import {RouteInterface} from "@/lib/route/route.interface";
import {Router} from "express";
import AuthRoute from "@/routes/auth.route";

type RouteConstructor = new (router: Router) => RouteInterface;

export const allRoutes: RouteConstructor[] = [
    AuthRoute,
    HealthRoutes,

]

