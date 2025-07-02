import {Request, Response, NextFunction} from "express";

class AuthorizationMiddleware {

    public authorizeUser = (req: Request, res: Response, next: NextFunction) => {}


    private extractHeaders(req: Request, next: NextFunction) {
        const payload: any = req.headers["authorization"] || null;
        if (!payload) {
        }
    }
}

export default AuthorizationMiddleware;