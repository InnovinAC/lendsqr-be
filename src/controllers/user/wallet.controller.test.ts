import request from 'supertest';
import express from 'express';
import WalletController from '@/controllers/user/wallet.controller';

jest.mock('@/middleware/authorization/authorization.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    authorizeUser: jest.fn().mockImplementation((req: any, res: any, next: any) => {
      req.user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        isBlacklisted: false,
        blacklistReason: '',
        blacklistedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      next();
    }),
  }));
});

describe('WalletController', () => {
  let app: express.Application;
  let controller: WalletController;
  let mockWalletService: any;

  beforeEach(() => {
    app = express();
    controller = new WalletController();

    mockWalletService = {
      findWalletByUser: jest.fn(),
      getUserTransactions: jest.fn(),
      fundWallet: jest.fn(),
      withdrawFunds: jest.fn(),
      transferFunds: jest.fn(),
    };

    (controller as any).walletService = mockWalletService;

    controller.initRoutes();
    app.use(express.json());
    app.use(controller.router);
  });

  describe('GET /', () => {
    it('should get user wallet successfully', async () => {
      const mockWallet = { id: 1, balance: 1000, currency: 'NGN' };
      mockWalletService.findWalletByUser.mockResolvedValue(mockWallet);

      const res = await request(app).get('/');

      expect(mockWalletService.findWalletByUser).toHaveBeenCalledWith(1);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User Wallet');
      expect(res.body.data).toEqual(mockWallet);
    });

    it('should handle wallet not found', async () => {
      mockWalletService.findWalletByUser.mockRejectedValue(new Error('Wallet not found'));

      const res = await request(app).get('/');

      expect(res.status).toBe(500);
    });
  });

  describe('GET /transactions', () => {
    it('should get user transactions successfully', async () => {
      const mockTransactions = [
        { id: 1, amount: 100, type: 'credit' },
        { id: 2, amount: 50, type: 'debit' },
      ];
      mockWalletService.getUserTransactions.mockResolvedValue(mockTransactions);

      const res = await request(app).get('/transactions');

      expect(mockWalletService.getUserTransactions).toHaveBeenCalledWith(1);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User Transactions');
      expect(res.body.data).toEqual(mockTransactions);
    });

    it('should handle transactions not found', async () => {
      mockWalletService.getUserTransactions.mockRejectedValue(new Error('No transactions'));

      const res = await request(app).get('/transactions');

      expect(res.status).toBe(500);
    });
  });

  describe('POST /fund', () => {
    it('should fund wallet successfully', async () => {
      const mockWallet = { id: 1, balance: 1000 };
      mockWalletService.findWalletByUser.mockResolvedValue(mockWallet);
      mockWalletService.fundWallet.mockResolvedValue(true);

      const fundData = {
        amount: 100,
        description: 'Test funding',
        metadata: { source: 'test' },
      };

      const res = await request(app).post('/fund').send(fundData);

      expect(mockWalletService.findWalletByUser).toHaveBeenCalledWith(1);
      expect(mockWalletService.fundWallet).toHaveBeenCalledWith({
        wallet_id: 1,
        amount: 100,
        description: 'Test funding',
        metadata: { source: 'test' },
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Wallet funded successfully.');
    });

    it('should handle funding error', async () => {
      mockWalletService.findWalletByUser.mockRejectedValue(new Error('Wallet not found'));

      const fundData = { amount: 100, description: 'Test funding' };

      const res = await request(app).post('/fund').send(fundData);

      expect(res.status).toBe(500);
    });
  });

  describe('POST /withdraw', () => {
    it('should withdraw funds successfully', async () => {
      const mockWallet = { id: 1, balance: 1000 };
      mockWalletService.findWalletByUser.mockResolvedValue(mockWallet);
      mockWalletService.withdrawFunds.mockResolvedValue(true);

      const withdrawData = {
        amount: 500,
        bank_details: {
          bank_name: 'Test Bank',
          account_number: '1234567890',
        },
      };

      const res = await request(app).post('/withdraw').send(withdrawData);

      expect(mockWalletService.findWalletByUser).toHaveBeenCalledWith(1);
      expect(mockWalletService.withdrawFunds).toHaveBeenCalledWith({
        wallet_id: 1,
        amount: 500,
        bank_details: {
          bank_name: 'Test Bank',
          account_number: '1234567890',
        },
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Withdrawal successful.');
    });

    it('should handle withdrawal error', async () => {
      mockWalletService.findWalletByUser.mockRejectedValue(new Error('Insufficient funds'));

      const withdrawData = {
        amount: 2000,
        bank_details: { bank_name: 'Test Bank', account_number: '1234567890' },
      };

      const res = await request(app).post('/withdraw').send(withdrawData);

      expect(res.status).toBe(500);
    });
  });

  describe('POST /transfer', () => {
    it('should transfer funds successfully', async () => {
      mockWalletService.transferFunds.mockResolvedValue(true);

      const transferData = {
        recipient_user_id: 2,
        amount: 100,
        description: 'Test transfer',
      };

      const res = await request(app).post('/transfer').send(transferData);

      expect(mockWalletService.transferFunds).toHaveBeenCalledWith({
        user_id: 1,
        recipient_user_id: 2,
        amount: 100,
        description: 'Test transfer',
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Transfer successful.');
    });

    it('should handle transfer error', async () => {
      mockWalletService.transferFunds.mockRejectedValue(new Error('Recipient not found'));

      const transferData = {
        recipient_user_id: 999,
        amount: 100,
        description: 'Test transfer',
      };

      const res = await request(app).post('/transfer').send(transferData);

      expect(res.status).toBe(500);
    });
  });

  describe('Validation errors', () => {
    it('should handle invalid fund request body', async () => {
      const res = await request(app).post('/fund').send({ invalid: 'data' });

      expect(res.status).toBe(422);
    });

    it('should handle invalid withdraw request body', async () => {
      const res = await request(app).post('/withdraw').send({ invalid: 'data' });

      expect(res.status).toBe(422);
    });

    it('should handle invalid transfer request body', async () => {
      const res = await request(app).post('/transfer').send({ invalid: 'data' });

      expect(res.status).toBe(422);
    });
  });
});
