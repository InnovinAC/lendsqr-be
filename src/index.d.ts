import {User} from "./models";

// enable req.user typing in controllers and middleware
declare global {
    namespace Express {
        export interface Request {
            user: User
        }
    }
}