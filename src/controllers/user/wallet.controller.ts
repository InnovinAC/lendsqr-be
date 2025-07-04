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

  /**
   * @openapi
   * /user/wallet/:
   *   get:
   *     tags:
   *       - Wallet
   *     summary: Get user wallet
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User wallet
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Wallet'
   *       401:
   *         description: Unauthorized
   */
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

  /**
   * @openapi
   * /user/wallet/transactions:
   *   get:
   *     tags:
   *       - Wallet
   *     summary: Get user wallet transactions
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User transactions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Transaction'
   *       401:
   *         description: Unauthorized
   */
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

  /**
   * @openapi
   * /user/wallet/fund:
   *   post:
   *     tags:
   *       - Wallet
   *     summary: Fund user wallet
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - amount
   *             properties:
   *               amount:
   *                 type: number
   *                 minimum: 100
   *               description:
   *                 type: string
   *               metadata:
   *                 type: object
   *     responses:
   *       200:
   *         description: Wallet funded successfully.
   *       401:
   *         description: Unauthorized
   *       422:
   *         description: Validation error
   */
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

  /**
   * @openapi
   * /user/wallet/withdraw:
   *   post:
   *     tags:
   *       - Wallet
   *     summary: Withdraw funds from wallet
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - amount
   *             properties:
   *               amount:
   *                 type: number
   *                 minimum: 500
   *               bank_details:
   *                 type: object
   *                 properties:
   *                   bank_name:
   *                     type: string
   *                   account_number:
   *                     type: string
   *     responses:
   *       200:
   *         description: Withdrawal successful.
   *       401:
   *         description: Unauthorized
   *       422:
   *         description: Validation error
   */
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

  /**
   * @openapi
   * /user/wallet/transfer:
   *   post:
   *     tags:
   *       - Wallet
   *     summary: Transfer funds to another user
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - recipient_user_id
   *               - amount
   *             properties:
   *               recipient_user_id:
   *                 type: integer
   *               amount:
   *                 type: number
   *                 minimum: 100
   *               description:
   *                 type: string
   *     responses:
   *       200:
   *         description: Transfer successful.
   *       401:
   *         description: Unauthorized
   *       422:
   *         description: Validation error
   */
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
