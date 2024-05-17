import * as z from 'zod';
import type { TypeOf } from 'zod';

export const AvailablePriceValidator = z.object({
  cost: z.number({ coerce: true })
    .min(
      100,
      [
        'Minimal price is a 100 RUB.',
        'Unfortunately, some of payment services have such restrictions',
      ].join(' '),
    )
    .max(1000000, 'Price plan is currently restricted by 1,000,000 roubles'),
  description: z.string()
    .min(32, 'Isn\'t it too short?'),
  isInfinity: z.boolean().optional().nullable(),
  period: z.number()
    .min(1)
    .max(100)
    .optional()
    .nullable(),
  periodUnit: z.enum(['days', 'months', 'weeks'])
    .optional()
    .nullable(),
  title: z.string()
    .min(3, 'Title is too short')
    .max(128, 'Title is too long'),
  // todo fix data mismatch wit backend data
  // to support technical data from frontend
  uuid: z.string().nullish(),
})
  .refine(
    ({ isInfinity, period  }) => !!isInfinity || !!period,
    {
      message: 'Period must be set if this subscription type is no infinity!',
      path: ['period'],
    }
  )
  .refine(
    ({ isInfinity, periodUnit  }) => !!isInfinity || !!periodUnit,
    {
      message: 'Period Unit must be set if this subscription type is no infinity!',
      path: ['periodUnit'],
    }
  );

export type AvailablePrice = TypeOf<typeof AvailablePriceValidator>;
