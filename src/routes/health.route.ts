import {RouteInterface} from "@/lib/route/route.interface";
import {Router} from "express";

export class HealthRoutes implements RouteInterface {
    private _appRouter: Router;

    constructor(public appRouter: Router) {
        this._appRouter = appRouter;
    }

    initRoutes(): void {
        this._appRouter.use('/health', (_req, res) => {
            res.status(200).send('OK');
        });
    }

}
