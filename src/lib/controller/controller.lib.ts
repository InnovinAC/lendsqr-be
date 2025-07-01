import {Router} from "express";

abstract class Controller {
    protected constructor(public router: Router) {
        this.router = router;
        this.initMiddleware();
        this.initServices();
        this.initRoutes();
    }

    abstract initMiddleware(): void
    abstract initServices(): void;
    abstract initRoutes(): void;

}
export default Controller