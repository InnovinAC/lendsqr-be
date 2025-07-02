import request from 'supertest';
import express, {Router} from 'express';
import {AuthRoute} from '@/routes/auth.route';
import AuthenticationController from '@/controllers/auth/authentication.controller';


jest.mock('@/controllers/auth/authentication.controller');

describe('AuthRoute', () => {
    let app: express.Express;
    let authRoute: AuthRoute;

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();
        app.use(express.json());

        authRoute = new AuthRoute(app);
    });

    describe('initRoutes', () => {
        it('should initialize auth routes', () => {
            const mockRouter = Router();
            const mockController = {router: mockRouter} as Partial<AuthenticationController>;

            (AuthenticationController as jest.Mock).mockImplementation(() => mockController as AuthenticationController);

            authRoute.initRoutes();

            expect(AuthenticationController).toHaveBeenCalledWith(app);
        });

        it('should mount auth routes under /auth prefix', async () => {
            const mockRouter = Router();
            mockRouter.get('/test', (_req, res) => {
                res.status(200).json({ ok: true });
            });

            const mockController = { router: mockRouter } as Partial<AuthenticationController>;
            (AuthenticationController as jest.Mock).mockImplementation(() => mockController as AuthenticationController);

            authRoute.initRoutes();

            const response = await request(app).get('/auth/test');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ ok: true });
        });

    });
});
