import { RouteInterface } from '@/lib/route/route.interface';
import { Router } from 'express';
import AuthenticationController from '@/controllers/auth/authentication.controller';

export class AuthRoute implements RouteInterface {
  constructor(public appRouter: Router) {}

  initRoutes(): void {
    this.appRouter.use('/auth', new AuthenticationController().router);
  }
}
export default AuthRoute;
