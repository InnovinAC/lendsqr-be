import { RouteInterface } from '@/lib/route/route.interface';
import { Router } from 'express';
import ProfileController from '@/controllers/user/profile.controller';
import WalletController from '@/controllers/user/wallet.controller';

export class UserRoute implements RouteInterface {
  constructor(public appRouter: Router) {}

  initRoutes(): void {
    this.appRouter.use('/user/profile', new ProfileController().router);
    this.appRouter.use('/user/wallet', new WalletController().router);
  }
}
export default UserRoute;
