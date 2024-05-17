import * as z from 'zod';
import type { TypeOf } from 'zod';

import { AvailablePriceValidator } from './available-price';
import { superRefineUniq } from './super-refine-uniq';

export const BotSellerRelatedDataValidator = z.object({
  aboutText: z.string()
    .min(32, [
      'About text must be quite informative.',
      'It means 32 symbols length at least.',
    ].join(' '))
    .max(
      512,
      'Too long notifications are not supported yet: 512 symbols maximum.',
    ),
  availablePrices: z.array(
    AvailablePriceValidator,
  )
    .min(1)
    .superRefine(superRefineUniq.bind('title')),
  privateChannelID: z.string()
    .min(9)
    .transform((value, context) => {
      if (/^(\d{9,12})$/.test(value)) {
        return value;
      }

      if (/^https:\/\/t\.me\/c\/\d{9,12}\/\d+$/.test(value)) {
        return value.split('/').reverse()[1];
      }

      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: [
          'Controlled channel ID must be 10 digits long (example: 1907156467).',
          'Or you can use link to any post in chat (example: https://t.me/c/1907156467/4).',
        ].join('\n'),
      });

      return z.NEVER;
    }),
  failedPaymentNotification: z.string()
    .min(32, [
      'Notification about a failed payment must be quite informative.',
      'It means 32 symbols length at least.',
    ].join(' '))
    .max(
      512,
      'Too long notifications are not supported yet: 512 symbols maximum.',
    ),
  publicName: z.string()
    .min(5, 'Too short public name')
    .max(64, 'Too long public name'),
  publicToken: z.string()
    .regex(
      /^\d{10}:[a-zA-Z0-9_\-]{32,40}$/,
      [
        'Invalid public bot token. Check link above to get know',
        'how to obtain correct token.',
      ].join(' '),
    ),
  paymentToken: z.string()
    .regex(
      /^\d{8,11}:\w+:\w{3,128}$/,
      [
        'Invalid payment token. Check link above to get know',
        'how to obtain correct token.',
      ].join(' '),
    ),
  successfulPaymentNotification: z.string()
    .min(32, [
      'Notification about a successful payment must be quite informative.',
      'It means 32 symbols length at least.',
    ].join(' '))
    .max(
      512,
      'Too long notifications are not supported yet: 512 symbols maximum.',
    ),
  welcomeText: z.string()
    .min(32, [
      'Welcome text must be quite informative.',
      'It means 32 symbols length at least.',
    ].join(' '))
    .max(
      512,
      'Too long notifications are not supported yet: 512 symbols maximum.',
    ),
})
  .strict();

export type BotSellerRelatedData = TypeOf<typeof BotSellerRelatedDataValidator>;
