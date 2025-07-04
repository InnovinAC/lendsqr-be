import {RouteInterface} from '@/lib/route/route.interface';
import {Router} from 'express';

class HealthRoute implements RouteInterface {
    constructor(public appRouter: Router) {
    }

    initRoutes(): void
    /**
     * @openapi
     * /health:
     *   post:
     *     tags:
     *       - Health check
     *     summary: Check if the app is healthy
     *     responses:
     *       200:
     *         description: App is healthy
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *               example: OK
     *       400:
     *         description: App is unhealthy
     */ {
        this.appRouter.use('/health', (_req, res) => {
            res.status(200).send('OK');
        });
    }
}

export default HealthRoute;
