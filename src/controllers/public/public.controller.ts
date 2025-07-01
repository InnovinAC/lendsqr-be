import Controller from "@/lib/controller/controller.lib";
import {Knex} from "knex";
import {Router, Request, Response, NextFunction} from "express";

class PublicController  extends Controller {
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
            res.send("GET /home");
        });
    }
}
export default PublicController;