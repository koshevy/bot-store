import {
  AvailablePriceValidator,
  BotSellerRelatedDataValidator,
} from '@bot-store/bot-subscription-seller-contract';
import { nanoid } from 'nanoid';
import type { DeepPartial } from 'react-hook-form';
import type { TypeOf } from 'zod';

// eslint-disable-next-line @nx/enforce-module-boundaries

type NullishObject<T> = { [K in keyof T]?: T[K] | null; };

export type PriceType = NullishObject<TypeOf<typeof AvailablePriceValidator>> & {
  uuid: string;
};
export const PreferencesFormValueValidator = BotSellerRelatedDataValidator;
export type PreferencesFormValueValidated = TypeOf<typeof PreferencesFormValueValidator>;
export type PreferencesFormValue = NullishObject<PreferencesFormValueValidated>;
export type PreferencesFormValuePartial = DeepPartial<PreferencesFormValue>;

export const preferencesFormDefaultValues = {
  aboutText: `
<p>
  This is a <strong>Demo Bot</strong> powered by
  <a
    target="_blank"
    rel="noopener noreferrer nofollow"
    href="https://botstore.online/"
  >
    BotStore Online
  </a>
  allowing you to receive the payment for a private channel.
</p>
<p>This bot able to manage permissions.</p>
`,
  availablePrices: [
    {
      cost: 100,
      description: [
        'You can buy the <strong>single-day subscription by demand</strong>',
        'in the moment when you need it. This plan is convenient',
        'as a trial-mode subscription until you make final decision.',
      ].join(' '),
      period: 1,
      periodUnit: 'days',
      title: 'Daily subscription',
    } as const,
    {
      cost: 200,
      description: [
        'Use this subscription as a <strong>middle-term trial period</strong>',
        'to be able to check the content quality over time.',
      ].join(' '),
      period: 1,
      periodUnit: 'weeks',
      title: 'Week subscription',
    } as const,
    {
      cost: 2000,
      description: [
        'This subscription plan <strong>allows you to save money</strong> if you really',
        'interested in content we provide.',
      ].join(' '),
      period: 12,
      periodUnit: 'months',
      title: 'Year subscription',
    } as const,
  ].map((item) => ({
    ...item,
    isInfinity: false,
    uuid: nanoid(),
  })),
  privateChannelID: '',
  failedPaymentNotification: [
    '<p><strong>Unfortunately, payment was not successful :(</strong></p>',
    '<p>If you believe that your money was spent, please, contact us.</p>',
  ].join('\n'),
  publicName: '',
  publicToken: '',
  successfulPaymentNotification: [
    '<p><strong>Payment successful!</strong></p>',
    '<p>You got prolonged subscription according to your plan.</p>',
  ].join('\n'),
  welcomeText: [
    '<p><strong>Welcome to our bot!</strong></p>',
    '<p>Here you can buy exclusive access to our paid content!</p>',
  ].join('\n'),
} as const satisfies PreferencesFormValue;

export function isKeyInPreferencesFormValue(key: string): key is keyof PreferencesFormValue {
  return key in PreferencesFormValueValidator.keyof().Values;
}
