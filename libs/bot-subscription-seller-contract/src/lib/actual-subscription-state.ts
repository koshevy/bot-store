import * as z from 'zod';
import { TypeOf } from 'zod';

export const TransactionHistoryRecordValidator = z.object({
  currency: z.enum(['RUB']),
  date: z.number().min(1696586072339),
  invoicePayload: z.string().optional(),
  orderInfo: z.any().optional(),
  providerChargeId: z.string(),
  telegramChargeId: z.string(),
  totalAmount: z.number().min(1),
  unusedBalanceAfterTransaction: z.number(),
});

export const ActualSubscriptionValidator = z.object({
  activeUntil: z.number().optional(),
  historyOfTransactions: z.array(
    TransactionHistoryRecordValidator,
  ).default([]),
  isBlocked: z.boolean().default(false),
  unusedBalance: z.number().default(0),
});

export type ActualSubscriptionState = TypeOf<typeof ActualSubscriptionValidator>;
export type TransactionHistoryRecord = TypeOf<
  typeof TransactionHistoryRecordValidator
>;
