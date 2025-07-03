export interface ICreateUser {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
}

export interface ILogin  extends Pick<ICreateUser, 'email'|'password'> {}

export interface ICreateWallet {
    currency?: string;
    user_id: number;
}
export interface IFundWallet {
    amount: number;
    wallet_id: number;
    description?: string;
    metadata?: any;
}
export interface IWithdrawFunds {
    amount: number;
    wallet_id: number;
    bank_details?: {
        bank_name: string;
        account_number: string;
    }
}
export interface ITransferFunds {
    user_id: number;
    recipient_user_id: number;
    amount: number;
    description?: string;
}