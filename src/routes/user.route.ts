import {RouteInterface} from "@/lib/route/route.interface";
import {Router} from "express";
import AuthenticationController from "@/controllers/auth/authentication.controller";
import ProfileController from "@/controllers/user/profile.controller";

export class UserRoute implements RouteInterface {

    constructor(public appRouter: Router) {}

    initRoutes(): void {
        this.appRouter.use('/user', new ProfileController(this.appRouter).router);
    }

}
export default UserRoute;
