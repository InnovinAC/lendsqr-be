import {Knex} from "knex";
import {Router} from "express";

abstract class Controller {
    public router: Router;
    protected constructor(protected db: Knex, router: Router) {
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