import Controller from '@/lib/controller/controller.lib';
import { NextFunction, Request, Response, Router } from 'express';
import createError from 'http-errors';
import ResponseHandler from '@/lib/api/response-handler.lib';
import AuthorizationMiddleware from '@/middleware/authorization/authorization.middleware';
import WalletService from '@/services/wallet.service';
import RequestValidator from '@/lib/api/request-validator.lib';
import userSchema from '@/validators/user.validator';
import { TypedRequest } from '@/index';
import { z } from 'zod';

class WalletController extends Controller {
  private authorizationMiddleware!: AuthorizationMiddleware;
  private walletService!: WalletService;

  constructor() {
    super(Router());
  }

  initMiddleware(): void {
    this.authorizationMiddleware = new AuthorizationMiddleware();
    this.setControllerMiddleware(this.authorizationMiddleware.authorizeUser);
  }

  initServices(): void {
    this.walletService = WalletService.getInstance();
  }

  initRoutes(): void {
    this.getUserWallet();
    this.getUserTransactions();
    this.fundUserWallet();
    this.withdrawFunds();
    this.transferFunds();
  }

  // If this were a real app, by design users should have multiple
  // wallets in various currencies.
  getUserWallet(): void {
    this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.walletService.findWalletByUser(req.user.id);
        ResponseHandler.sendSuccess(res, 'User Wallet', 200, data);
      } catch (e: any) {
        return next(createError(e));
      }
    });
  }

  getUserTransactions(): void {
    this.router.get('/transactions', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.walletService.getUserTransactions(req.user.id);
        ResponseHandler.sendSuccess(res, 'User Transactions', 200, data);
      } catch (e: any) {
        return next(createError(e));
      }
    });
  }

  fundUserWallet(): void {
    this.router.post(
      '/fund',
      RequestValidator.validate(userSchema.FUND_WALLET),
      async (
        req: TypedRequest<{}, z.infer<typeof userSchema.FUND_WALLET>>,
        res: Response,
        next: NextFunction,
      ) => {
        try {
          const wallet = await this.walletService.findWalletByUser(req.user.id);
          await this.walletService.fundWallet({
            wallet_id: wallet.id,
            amount: req.body.amount,
            description: req.body.description,
            metadata: req.body.metadata,
          });
          ResponseHandler.sendSuccess(res, 'Wallet funded successfully.');
        } catch (e: any) {
          return next(createError(e));
        }
      },
    );
  }

  withdrawFunds(): void {
    this.router.post(
      '/withdraw',
      RequestValidator.validate(userSchema.WITHDRAW_FUNDS),
      async (
        req: TypedRequest<{}, z.infer<typeof userSchema.WITHDRAW_FUNDS>>,
        res: Response,
        next: NextFunction,
      ) => {
        try {
          const wallet = await this.walletService.findWalletByUser(req.user.id);

          await this.walletService.withdrawFunds({
            wallet_id: wallet.id,
            amount: req.body.amount,
            bank_details: req.body.bank_details,
          });

          ResponseHandler.sendSuccess(res, 'Withdrawal successful.');
        } catch (error: any) {
          next(error);
        }
      },
    );
  }

  transferFunds(): void {
    this.router.post(
      '/transfer',
      RequestValidator.validate(userSchema.TRANSFER_FUNDS),
      async (
        req: TypedRequest<{}, z.infer<typeof userSchema.TRANSFER_FUNDS>>,
        res: Response,
        next: NextFunction,
      ) => {
        try {
          await this.walletService.transferFunds({
            user_id: req.user.id,
            recipient_user_id: req.body.recipient_user_id,
            amount: req.body.amount,
            description: req.body.description,
          });
          ResponseHandler.sendSuccess(res, 'Transfer successful.');
        } catch (error: any) {
          next(error);
        }
      },
    );
  }
}

export default WalletController;
