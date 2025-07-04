import { Timestamp } from '@/models/timestamp';
export enum TransactionType {
  FUND = 'fund',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
  TRANSFER = 'transfer',
  WITHDRAWAL = 'withdrawal',
}

export enum TransactionStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Transaction extends Timestamp {
  id: number;
  wallet_id: number;
  type: TransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  currency: string;
  status: TransactionStatus;
  reference: string;
  recipient_wallet_id: number;
  description: string;
  metadata: any;
}
