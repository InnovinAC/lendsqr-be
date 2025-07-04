import {User} from "./models";
import {Request} from "express";

// enable req.user typing in controllers and middleware
declare global {
    namespace Express {
        export interface Request {
            user: User
        }
    }
}


export type TypedRequest<
    P = Record<string, any>,
    B = Record<string, any>,
    Q = Record<string, any>
> = Request<P, any, B, Q>;
