import Service from '@/lib/service/service.lib';
import { TableName } from '@/config/database.config';
import {
  ICreateWallet,
  IFundWallet,
  ITransferFunds,
  IWithdrawFunds,
} from '@/interfaces/user.interface';
import { Transaction, type Wallet } from '@/models';
import { TransactionStatus, TransactionType } from '@/models/transaction.model';
import createError from 'http-errors';
import { Knex } from 'knex';
import generateReference from '@/utils/generate-reference.utils';

class WalletService extends Service {
  constructor() {
    super();
  }

  async findWalletById(id: number): Promise<Wallet> {
    return this.db.table<Wallet>(TableName.WALLET).where('id', id).first();
  }

  // defaulting to one wallet per user
  // In a real world scenario, users obviously
  // should have multiple wallets
  async findWalletByUser(user_id: number): Promise<Wallet> {
    return this.db.table<Wallet>(TableName.WALLET).where('user_id', user_id).first();
  }

  async createWallet(data: ICreateWallet): Promise<Wallet> {
    if (!data.currency) data.currency = 'NGN';
    if (await this.findWalletByUser(data.user_id)) {
      throw createError.BadRequest('Wallet already exists');
    }
    const [id] = await this.db.table(TableName.WALLET).insert(data);
    return this.db.table<Wallet>(TableName.WALLET).where('id', id).first();
  }

  async fundWallet(data: IFundWallet): Promise<void> {
    data.amount = parseFloat(data.amount as any);
    const wallet = await this.findWalletById(data.wallet_id);
    if (!wallet) {
      throw createError.NotFound('Wallet not found');
    }
    const walletBalance = parseFloat(wallet.balance as any);
    await this.db.transaction(async (tx) => {
      await this.addTransaction(
        {
          ...data,
          status: TransactionStatus.COMPLETED,
          balance_before: walletBalance,
          balance_after: walletBalance + data.amount,
          reference: generateReference(TransactionType.FUND),
        },
        tx,
      );
      await this.increaseWalletBalance(data.wallet_id, data.amount, tx);
    });
  }

  async withdrawFunds(data: IWithdrawFunds): Promise<void> {
    data.amount = parseFloat(data.amount as any);
    const wallet = await this.canWithdrawAmount(data.wallet_id, data.amount);
    const walletBalance = parseFloat((wallet as Wallet).balance as any);
    await this.db.transaction(async (tx) => {
      await this.addTransaction(
        {
          wallet_id: data.wallet_id,
          amount: data.amount,
          reference: generateReference(TransactionType.WITHDRAWAL),
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.COMPLETED,
          balance_before: walletBalance,
          balance_after: walletBalance - data.amount,
          metadata: {
            bank_details: data.bank_details,
          },
        },
        tx,
      );
      await this.decreaseWalletBalance(data.wallet_id, data.amount, tx);
    });
  }

  async transferFunds(data: ITransferFunds): Promise<void> {
    if (data.user_id == data.recipient_user_id) {
      throw createError.BadRequest('Cannot transfer funds to yourself.');
    }
    const senderWallet = await this.findWalletByUser(data.user_id);
    const recipientWallet = await this.findWalletByUser(data.recipient_user_id);

    if (!senderWallet) throw createError.NotFound('Sender wallet not found');
    if (!recipientWallet) throw createError.NotFound('Recipient wallet not found');

    const senderBalance = parseFloat(senderWallet.balance as any);
    const recipientBalance = parseFloat(recipientWallet.balance as any);

    if (senderBalance < data.amount) {
      throw createError.BadRequest('Insufficient funds');
    }
    if (!recipientWallet) {
      throw createError.NotFound('Recipient wallet not found');
    }

    const reference = generateReference(TransactionType.TRANSFER);

    await this.db.transaction(async (tx) => {
      const senderReference = generateReference(TransactionType.TRANSFER_OUT);
      await this.addTransaction(
        {
          wallet_id: senderWallet.id,
          recipient_wallet_id: recipientWallet.id,
          amount: data.amount,
          type: TransactionType.TRANSFER_OUT,
          status: TransactionStatus.COMPLETED,
          balance_before: senderBalance,
          balance_after: senderBalance - data.amount,
          reference: senderReference,
          description: data.description,
        },
        tx,
      );

      await this.decreaseWalletBalance(senderWallet.id, data.amount, tx);

      const recipientReference = generateReference(TransactionType.TRANSFER_IN);
      await this.addTransaction(
        {
          wallet_id: recipientWallet.id,
          amount: data.amount,
          type: TransactionType.TRANSFER_IN,
          status: TransactionStatus.COMPLETED,
          balance_before: recipientBalance,
          balance_after: recipientBalance + data.amount,
          reference: recipientReference,
          description: data.description,
        },
        tx,
      );

      await this.increaseWalletBalance(recipientWallet.id, data.amount, tx);
    });
  }

  async getUserTransactions(userId: number, type?: TransactionType): Promise<Transaction[]> {
    const wallet = await this.findWalletByUser(userId);
    if (!wallet) {
      throw createError.NotFound('No transactions for user');
    }

    const query = this.db.table<Transaction>(TableName.TRANSACTIONS).where(function () {
      this.where('wallet_id', wallet.id).orWhere('recipient_wallet_id', wallet.id);
    });

    if (type) {
      query.andWhere('type', type);
    }

    return query.orderBy('created_at', 'desc').select();
  }

  private async addTransaction(
    data: Partial<Transaction>,
    transaction?: Knex.Transaction,
  ): Promise<void> {
    await (transaction || this.db).table<Transaction>(TableName.TRANSACTIONS).insert(data);
  }

  // Making use of increment for atomicity to avoid wrong values
  private async increaseWalletBalance(
    id: number,
    amount: number,
    transaction?: Knex.Transaction,
  ): Promise<void> {
    await (transaction || this.db).table(TableName.WALLET).where('id', id).increment({
      balance: amount,
    });
  }

  // Making use of decrement for atomicity to avoid wrong values
  private async decreaseWalletBalance(
    id: number,
    amount: number,
    transaction?: Knex.Transaction,
  ): Promise<void> {
    await (transaction || this.db).table(TableName.WALLET).where('id', id).decrement({
      balance: amount,
    });
  }

  // check if user can take out a particular amount from their wallet
  private async canWithdrawAmount(walletId: number, amount: number): Promise<Wallet> {
    const wallet = await this.findWalletById(walletId);
    if (!wallet) {
      throw createError.NotFound('Wallet not found');
    }

    if (wallet.balance < amount) {
      throw createError.BadRequest('Insufficient wallet balance');
    } else {
      return wallet;
    }
  }
}

export default WalletService;
