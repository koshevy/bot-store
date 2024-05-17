import { faker } from '@faker-js/faker';

import { Draft } from '../draft';

const bulkPayloadFn = () => ({});

export function createDraftFixture<T extends object = object>(
  createPayload: (() => T) = bulkPayloadFn as any,
  mode: 'recent' | 'past' = 'recent',
): Draft<T> {
  return {
    dateTime: (
      mode === 'recent' ? faker.date.recent() : faker.date.past()
    ).toISOString(),
    payload: createPayload(),
    uuid: faker.string.uuid(),
  };
}

export function createDraftArrayFixture<T extends object = object>(
  createPayload: (() => T) = bulkPayloadFn as any,
  modes: Array<'recent' | 'past'> = [
    'recent',
    'recent',
    'past',
    'past',
    'past',
    'past',
  ],
): Array<Draft<T>> {
  return modes.map(
    (mode) => createDraftFixture(createPayload, mode),
  );
}
