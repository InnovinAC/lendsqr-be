import {HealthRoutes} from "@/routes/health.route";
import {RouteInterface} from "@/lib/route/route.interface";
import {Router} from "express";
import {PublicRoute} from "@/routes/public.route";

type RouteConstructor = new (router: Router) => RouteInterface;

export const allRoutes: RouteConstructor[] = [
    HealthRoutes,
    PublicRoute
]

