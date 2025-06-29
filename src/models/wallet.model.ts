import {Timestamp} from "@/models/timestamp";

export interface Wallet extends Timestamp {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    isActive: boolean;
}