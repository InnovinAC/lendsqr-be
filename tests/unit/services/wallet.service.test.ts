import WalletService from '@/services/wallet.service';
import createError from 'http-errors';
import { TableName } from '@/config/database.config';

jest.mock('@/lib/service/service.lib');

describe('WalletService', () => {
  let walletService: WalletService;
  let mockDb: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDb = {
      table: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      transaction: jest.fn(),
      insert: jest.fn(),
      orderBy: jest.fn().mockReturnThis(),
      select: jest.fn(),
    };

    walletService = new WalletService();
    (walletService as any).db = mockDb;
  });

  describe('findWalletByUser', () => {
    it('should find wallet by user id', async () => {
      const userId = 1;
      const mockWallet = {
        id: 1,
        user_id: userId,
        balance: 1000,
        currency: 'NGN',
      };

      mockDb.first.mockResolvedValue(mockWallet);

      const result = await walletService.findWalletByUser(userId);

      expect(mockDb.table).toHaveBeenCalledWith('wallets');
      expect(mockDb.where).toHaveBeenCalledWith('user_id', 1);
      expect(result).toEqual(mockWallet);
    });
  });

  describe('getUserTransactions', () => {
    it('should get user transactions', async () => {
      const userId = 1;
      const mockTransactions = [
        { id: 1, amount: 100, type: 'credit' },
        { id: 2, amount: 50, type: 'debit' },
      ];
      jest.spyOn(walletService, 'findWalletByUser').mockResolvedValue({
        id: 1,
        balance: 0,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 1,
        is_active: true,
        currency: 'NGN',
      });

      mockDb.select.mockResolvedValue(mockTransactions);

      const result = await walletService.getUserTransactions(userId);

      expect(mockDb.table).toHaveBeenCalledWith(TableName.TRANSACTIONS);
      expect(result).toEqual(mockTransactions);
    });
  });

  describe('fundWallet', () => {
    it('should fund wallet successfully', async () => {
      const fundData = {
        wallet_id: 1,
        amount: 100,
        description: 'Test funding',
        metadata: {},
      };
      jest.spyOn(walletService, 'findWalletById').mockResolvedValue({
        id: 1,
        balance: 0,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 1,
        is_active: true,
        currency: 'NGN',
      });

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        await callback({
          table: jest.fn().mockReturnThis(),
          insert: jest.fn().mockResolvedValue([1]),
          where: jest.fn().mockReturnThis(),
          increment: jest.fn().mockReturnThis(),
        });
      });
      mockDb.transaction.mockImplementation(mockTransaction);

      await walletService.fundWallet(fundData);

      expect(mockDb.transaction).toHaveBeenCalled();
    });

    it('should throw error when wallet not found', async () => {
      const fundData = {
        wallet_id: 999,
        amount: 100,
        description: 'Test funding',
        metadata: { source: 'test' },
      };

      mockDb.first.mockResolvedValue(null);

      await expect(walletService.fundWallet(fundData)).rejects.toThrow(
        createError.NotFound('Wallet not found'),
      );
    });
  });

  describe('withdrawFunds', () => {
    it('should withdraw funds successfully', async () => {
      const withdrawData = {
        wallet_id: 1,
        amount: 50,
        bank_details: {
          bank_name: 'Test Bank',
          account_number: '1234567890',
        },
      };

      const mockWallet = { id: 1, balance: 1000 };
      mockDb.first.mockResolvedValue(mockWallet);

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        await callback({
          table: jest.fn().mockReturnThis(),
          insert: jest.fn().mockResolvedValue([1]),
          where: jest.fn().mockReturnThis(),
          decrement: jest.fn().mockReturnThis(),
        });
      });
      mockDb.transaction.mockImplementation(mockTransaction);

      await walletService.withdrawFunds(withdrawData);

      expect(mockDb.transaction).toHaveBeenCalled();
    });

    it('should throw error when insufficient funds', async () => {
      const withdrawData = {
        wallet_id: 1,
        amount: 2000,
        bank_details: {
          bank_name: 'Test Bank',
          account_number: '1234567890',
        },
      };

      const mockWallet = { id: 1, balance: 1000 };
      mockDb.first.mockResolvedValue(mockWallet);

      await expect(walletService.withdrawFunds(withdrawData)).rejects.toThrow(
        createError.BadRequest,
      );
    });
  });

  describe('transferFunds', () => {
    it('should transfer funds successfully', async () => {
      const transferData = {
        user_id: 1,
        recipient_user_id: 2,
        amount: 100,
        description: 'Test transfer',
      };

      const mockSenderWallet = { id: 1, balance: 1000 };
      const mockRecipientWallet = { id: 2, balance: 500 };

      mockDb.first
        .mockResolvedValueOnce(mockSenderWallet)
        .mockResolvedValueOnce(mockRecipientWallet);

      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        await callback({
          table: jest.fn().mockReturnThis(),
          insert: jest.fn().mockResolvedValue([1]),
          where: jest.fn().mockReturnThis(),
          increment: jest.fn().mockReturnThis(),
          decrement: jest.fn().mockReturnThis(),
        });
      });
      mockDb.transaction.mockImplementation(mockTransaction);

      await walletService.transferFunds(transferData);

      expect(mockDb.transaction).toHaveBeenCalled();
    });

    it('should throw error when sender wallet not found', async () => {
      const transferData = {
        user_id: 1,
        recipient_user_id: 2,
        amount: 100,
        description: 'Test transfer',
      };

      mockDb.first.mockResolvedValue(null);

      await expect(walletService.transferFunds(transferData)).rejects.toThrow(
        createError.NotFound('Sender wallet not found'),
      );
    });

    it('should throw error when recipient wallet not found', async () => {
      const transferData = {
        user_id: 1,
        recipient_user_id: 2,
        amount: 100,
        description: 'Test transfer',
      };

      const mockSenderWallet = { id: 1, balance: 1000 };
      mockDb.first.mockResolvedValueOnce(mockSenderWallet).mockResolvedValueOnce(null);

      await expect(walletService.transferFunds(transferData)).rejects.toThrow(createError.NotFound);
    });
  });
});
