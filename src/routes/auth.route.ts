import {RouteInterface} from "@/lib/route/route.interface";
import {Router} from "express";
import AuthenticationController from "@/controllers/public/authentication.controller";

export class AuthRoute implements RouteInterface {

    constructor(public appRouter: Router) {}

    initRoutes(): void {
        this.appRouter.use('/auth', new AuthenticationController(this.appRouter).router);
    }

}
export default AuthRoute;
