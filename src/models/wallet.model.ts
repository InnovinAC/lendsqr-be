import {Timestamp} from "@/models/timestamp";

export interface Wallet extends Timestamp {
    id: number;
    user_id: number;
    balance: number;
    currency: string;
    is_active: boolean;
}