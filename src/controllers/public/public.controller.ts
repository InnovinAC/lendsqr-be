import Controller from "@/lib/controller/controller.lib";
import {NextFunction, Request, Response, Router} from "express";
import ResponseHandler from "@/lib/response-handler.lib";

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
        this.router.get("/home", (req: Request, res: Response) => {
             ResponseHandler.sendSuccess(res, "Testing", 200);
        });
    }

}

export default PublicController;