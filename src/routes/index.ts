import {HealthRoutes} from "@/routes/health.route";
import {RouteInterface} from "@/lib/route/route.interface";
import {Router} from "express";
import {Knex} from "knex";

type RouteConstructor = new (router: Router, db: Knex) => RouteInterface;

export const allRoutes: RouteConstructor[] = [
    HealthRoutes,

]

