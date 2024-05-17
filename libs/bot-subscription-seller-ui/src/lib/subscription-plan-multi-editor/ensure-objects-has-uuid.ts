import { nanoid } from 'nanoid';

interface HasUuid {
  uuid?: string
}

export function ensureObjectsHasUuid<T extends HasUuid>(
  value: readonly T[] | undefined | null,
  fallbackValue: Array<T & Required<HasUuid>>,
): Array<T & Required<HasUuid>> {
  if (!value?.length) {
    return fallbackValue;
  }

  if (!value.some(({ uuid }) => !uuid)) {
    return value as Array<T & Required<HasUuid>>;
  }

  return value.map<T & Required<HasUuid>>((objValue) => (
    objValue.uuid ? objValue as T & Required<HasUuid> : {
      ...objValue,
      uuid: nanoid(),
    }
  ));
}
