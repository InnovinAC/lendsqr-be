import Controller from "@/lib/controller/controller.lib";
import {NextFunction, Request, Response, Router} from "express";
import createError from "http-errors";
import ResponseHandler from "@/lib/api/response-handler.lib";
import AuthorizationMiddleware from "@/middleware/authorization/authorization.middleware";

class ProfileController extends Controller {
    private authorizationMiddleware!: AuthorizationMiddleware;

    constructor() {
        super(Router());
    }

    initMiddleware(): void {
        this.authorizationMiddleware = new AuthorizationMiddleware();
        this.setControllerMiddleware(this.authorizationMiddleware.authorizeUser);
    }

    initServices(): void {
    }

    initRoutes(): void {
        this.getUserProfile();
    }

    getUserProfile(): void {
        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            try {
                const data = req.user;
                ResponseHandler.sendSuccess(res, "User Profile", 200, data);
            } catch (e: any) {
                return next(createError(e));
            }
        });
    }
}

export default ProfileController;