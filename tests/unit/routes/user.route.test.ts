import request from 'supertest';
import express, { Router } from 'express';
import { UserRoute } from '@/routes/user.route';
import ProfileController from '@/controllers/user/profile.controller';
import WalletController from '@/controllers/user/wallet.controller';

jest.mock('@/controllers/user/profile.controller');
jest.mock('@/controllers/user/wallet.controller');

describe('UserRoute', () => {
    let app: express.Express;
    let userRoute: UserRoute;

    beforeEach(() => {
        jest.clearAllMocks();

        app = express();
        app.use(express.json());

        userRoute = new UserRoute(app);
    });

    describe('initRoutes', () => {
        it('should initialize user routes', () => {
            const mockProfileRouter = Router();
            const mockWalletRouter = Router();

            const mockProfileController = { router: mockProfileRouter } as Partial<ProfileController>;
            const mockWalletController = { router: mockWalletRouter } as Partial<WalletController>;

            (ProfileController as jest.Mock).mockImplementation(() => mockProfileController as ProfileController);
            (WalletController as jest.Mock).mockImplementation(() => mockWalletController as WalletController);

            userRoute.initRoutes();

            expect(ProfileController).toHaveBeenCalled();
            expect(WalletController).toHaveBeenCalled();
        });

        it('should mount profile and wallet routes at correct paths', async () => {
            const mockProfileRouter = Router();
            const mockWalletRouter = Router();

            mockProfileRouter.get('/test', (_req, res) => {
                res.status(200).json({ profile: true });
            });

            mockWalletRouter.get('/test', (_req, res) => {
                res.status(200).json({ wallet: true });
            });

            const mockProfileController = { router: mockProfileRouter } as Partial<ProfileController>;
            const mockWalletController = { router: mockWalletRouter } as Partial<WalletController>;

            (ProfileController as jest.Mock).mockImplementation(() => mockProfileController as ProfileController);
            (WalletController as jest.Mock).mockImplementation(() => mockWalletController as WalletController);

            userRoute.initRoutes();

            const profileResponse = await request(app).get('/user/profile/test');
            const walletResponse = await request(app).get('/user/wallet/test');

            expect(profileResponse.status).toBe(200);
            expect(profileResponse.body).toEqual({ profile: true });
            expect(walletResponse.status).toBe(200);
            expect(walletResponse.body).toEqual({ wallet: true });
        });
    });
});