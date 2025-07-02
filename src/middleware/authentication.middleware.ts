import { NextFunction, Request, Response } from "express";
import UserService from "@/services/user.service";
import createError from "http-errors";

class AuthenticationMiddleware {
  /**
   * Check if email is unique (for registration)
   */
  public checkExistingEmail = async (req: Request, res: Response, next: NextFunction) => {
    const isNewUser = await UserService.getInstance().isUniqueEmail(req.body.email);
    if (!isNewUser) {
      // I deliberately did not send a response saying "User already exists" or similar
      // because that way someone can tell that a user is signed up by calling
      // the api
      return next(createError.BadRequest("Invalid email address"));
    }
    return next();
  };
}

export default AuthenticationMiddleware;