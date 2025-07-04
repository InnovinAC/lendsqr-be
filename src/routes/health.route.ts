import { RouteInterface } from '@/lib/route/route.interface';
import { Router } from 'express';

class HealthRoute implements RouteInterface {
  constructor(public appRouter: Router) {}

  initRoutes(): void {
    this.appRouter.use('/health', (_req, res) => {
      res.status(200).send('OK');
    });
  }
}
export default HealthRoute;
