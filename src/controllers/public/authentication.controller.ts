import Controller from "@/lib/controller/controller.lib";
import AuthenticationMiddleware from "@/middleware/authentication.middleware";
import {NextFunction, Request, Response, Router} from "express";
import RequestValidator from "@/lib/api/request-validator.lib";
import authenticationSchema from "@/validators/authentication.validator";

class AuthenticationController extends Controller {
    private authenticationMiddleware!: AuthenticationMiddleware;
    constructor(router: Router) {
        super(router);
    }

    initMiddleware(): void {
        this.authenticationMiddleware = new AuthenticationMiddleware();
    }

    initRoutes(): void {
        this.registerUser();
    }

    initServices(): void {
    }

    public registerUser() {
        this.router.post("/register", RequestValidator.validate(authenticationSchema.REGISTER));
        this.router.post("/register", this.authenticationMiddleware.checkExistingEmail);
        this.router.post("/register", (req: Request, res: Response, next: NextFunction) => {
            // const data = await
        });
    }

}

export default AuthenticationController;