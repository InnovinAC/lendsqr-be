import {Timestamp} from "@/models/timestamp";
export enum TransactionType {
    FUND = 'fund',
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
    id: string;
    walletId: string;
    type: TransactionType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    currency: string;
    status: TransactionStatus;
    reference: string;
    recipientWalletId: string;
    description: string;
    metadata: any;
}