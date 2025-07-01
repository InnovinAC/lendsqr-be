import {RouteInterface} from "@/lib/route/route.interface";
import {Router} from "express";
import {Knex} from "knex";
import PublicController from "@/controllers/public/public.controller";

export class PublicRoute implements RouteInterface {

    constructor(public appRouter: Router) {}

    initRoutes(): void {
        this.appRouter.use('/public', new PublicController(this.appRouter).router);
    }

}
