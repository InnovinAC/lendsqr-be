import { type NextFunction, type Request, type Response } from 'express';
import createError from 'http-errors';
import UserService from '@/services/user.service';
import JwtService from '@/services/jwt.service';
import SessionService from '@/services/session.service';
import { JwtPayload } from 'jsonwebtoken';

class AuthorizationMiddleware {
    private sessionService: SessionService;

    constructor() {
        this.sessionService = SessionService.getInstance();
    }

  public authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = this.extractHeaders(req, next);
    const decodedObj = JwtService.verify(token) as JwtPayload & { sessionId?: number };

    if (!decodedObj?.userId || !decodedObj?.sessionId) {
      return next(createError.Unauthorized('Token expired or invalid'));
    }

    // Check session validity
    const session = await this.sessionService.findActiveSession(decodedObj.sessionId);

    if (!session) {
      return next(createError.Unauthorized('Session expired or revoked'));
    }

    // Sliding expiry: extend session expiry by 1 hour from current datetime
    const newExpiresAt = new Date(new Date().getTime() + 60 * 60 * 1000);
    await this.sessionService.extendSession(session.id, newExpiresAt);
    const user = await new UserService().findUserById(decodedObj.userId);

    if (!user) {
      return next(createError.Unauthorized('Invalid User'));
    }

    const { password, ...theRest } = user;
    req.user = theRest;
    return next();
  };

  private extractHeaders(req: Request, next: NextFunction) {
    const payload: any = req.headers['authorization'] || null;
    if (!payload) {
      return next(createError.Unauthorized('Access token is required'));
    }

    const token = payload.split(' ')[1];

    if (!token) {
      return next(createError.Unauthorized('No auth token provided'));
    }
    return token;
  }
}

export default AuthorizationMiddleware;
