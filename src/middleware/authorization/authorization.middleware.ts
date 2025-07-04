import {type NextFunction, type Request, type Response} from "express";
import createError from "http-errors";
import UserService from "@/services/user.service";
import JwtService from "@/services/jwt.service";
import {JwtPayload} from "jsonwebtoken";

class AuthorizationMiddleware {

    public authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
        const token = this.extractHeaders(req, next);
        const decodedObj = JwtService.verify(token) as JwtPayload;
        if (!decodedObj?.userId) {
            return next(createError.Unauthorized("Token expired"));
        }
        const user = await new UserService().findUserById(decodedObj.userId);

        if (!user) {
            return next(createError.Unauthorized("Invalid User"));
        }
        const {password, ...theRest} = user;
        req.user = theRest;
        return next();
    }


    private extractHeaders(req: Request, next: NextFunction) {
        const payload: any = req.headers["authorization"] || null;
        if (!payload) {
            return next(createError.Unauthorized('Access token is required'))
        }

        const token = payload.split(' ')[1]

        if (!token) {
            return next(createError.Unauthorized('No auth token provided'))
        }
        return token
    }

}

export default AuthorizationMiddleware;