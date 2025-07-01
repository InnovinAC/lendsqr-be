import Controller from "@/lib/controller/controller.lib";
import {NextFunction, Request, Response, Router} from "express";
import ResponseHandler from "@/lib/response-handler.lib";
import createHttpError from "http-errors";

class PublicController extends Controller {
    constructor(router: Router) {
        super(router);

    }

    initMiddleware(): void {
    }

    initRoutes(): void {
        this.getHome();
    }

    initServices(): void {
    }

    private getHome() {
        this.router.get("/home", (req: Request, res: Response, next: NextFunction) => {
                throw createHttpError[403]("An error occurred test")
                ResponseHandler.sendSuccess(res, "Testing", 200);
        });
    }

}

export default PublicController;