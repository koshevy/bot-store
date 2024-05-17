import { faker } from '@faker-js/faker';

import {
  PreferencesFormValue,
  preferencesFormDefaultValues,
} from '../preferences-form-value';

type NonNullableRequired<T> = Required<{ [P in keyof T]: NonNullable<T[P]> }>;

export const createFilledFormValueFixture: () => NonNullableRequired<
PreferencesFormValue
> = () => ({
  ...preferencesFormDefaultValues,
  aboutText: faker.commerce.productDescription(),
  availablePrices: faker.helpers.shuffle(
    preferencesFormDefaultValues.availablePrices,
  ),
  paymentToken: createPaymentTokenFixture(),
  publicName: faker.commerce.productName(),
  publicToken: createPublicTokenFixture(),
  privateChannelID: createChannelIdFixture(),
});

function createPaymentTokenFixture(): string {
  return [
    faker.string.numeric({ length: 10 }),
    'TEST',
    faker.string.numeric({ length: 5 }),
  ].join(':');
}

function createChannelIdFixture(): string {
  return faker.string.numeric({ length: 10 });
}

function createPublicTokenFixture(): string {
  const postfix = [
    faker.string.alpha({ length: 5 }),
    faker.string.alphanumeric({ length: 29 }),
  ].join('-');

  return `${createChannelIdFixture()}:${postfix}`;
}
