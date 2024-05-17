import { faker } from '@faker-js/faker';
import { nanoid } from 'nanoid';

import type { SubscriptionPlan } from '../subscription-plan';

type PeriodType = | SubscriptionPlan['periodUnit']
| 'infinity'
| 'infinityOverPeriod';

const getRandomPeriodType = (): PeriodType => (
  faker.helpers.arrayElement([
    'days',
    'infinity',
    'infinityOverPeriod',
    'months',
    'weeks',
  ])
);

/**
 * To be a part of {@link SubscriptionPlansEditorProps['nonStable__uuidGeneratorFn']}
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const nonStable__uuidGeneratorFn = (position: number) => `item_${position}`;

export function createEmptySubscriptionPlanFixture(
  knownPosition?: number,
): Partial<SubscriptionPlan> & { uuid: string; } {
  return {
    uuid: (knownPosition === undefined)
      ? nanoid()
      : nonStable__uuidGeneratorFn(knownPosition),
  };
}

export function createSubscriptionPlanFixture(
  periodType: PeriodType = getRandomPeriodType(),
  knownPosition?: number,
): SubscriptionPlan {
  let periodUnitAddition: Partial<SubscriptionPlan> = {};

  // eslint-disable-next-line default-case
  switch (periodType) {
    case 'infinity':
      periodUnitAddition = {
        isInfinity: true,
      };
      break;
    case 'infinityOverPeriod':
      periodUnitAddition = {
        isInfinity: true,
        period: faker.number.int({ min: 7, max: 30 }),
        periodUnit: 'days',
      };
      break;
    case 'days':
      periodUnitAddition = {
        period: faker.number.int({ min: 7, max: 30 }),
        periodUnit: periodType,
      };
      break;
    case 'weeks':
      periodUnitAddition = {
        period: faker.number.int({ min: 2, max: 8 }),
        periodUnit: periodType,
      };
      break;
    case 'months':
      periodUnitAddition = {
        period: faker.number.int({ min: 1, max: 36 }),
        periodUnit: periodType,
      };
  }

  return {
    ...periodUnitAddition,
    cost: faker.number.int({ min: 100, max: 10000 }),
    description: faker.commerce.productDescription(),
    title: faker.commerce.productName(),
    uuid: (knownPosition === undefined)
      ? nanoid()
      : nonStable__uuidGeneratorFn(knownPosition),
  };
}
