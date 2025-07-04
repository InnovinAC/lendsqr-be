import { z } from 'zod';

const amountSchema = z.object({
  amount: z.number().min(100, 'Minimum amount is 100'),
});

const userSchema = {
  FUND_WALLET: z
    .object({
      description: z.string().optional(),
      metadata: z.any().optional(),
    })
    .merge(amountSchema),

  WITHDRAW_FUNDS: z.object({
    amount: z.number().min(500, 'Minimum amount is 500'),
    bank_details: z
      .object({
        bank_name: z.string(),
        account_number: z.string(),
      })
      .optional(),
  }),

  TRANSFER_FUNDS: z
    .object({
      recipient_user_id: z.number().int().positive('Recipient ID must be a positive number'),
      description: z.string().optional(),
    })
    .merge(amountSchema),
};

export default userSchema;
