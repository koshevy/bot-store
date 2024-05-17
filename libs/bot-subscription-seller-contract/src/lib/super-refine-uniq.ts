import type { RefinementCtx } from 'zod';

export function superRefineUniq<TValue extends Record<string, unknown>>(
  this: keyof TValue,
  values: TValue[],
  context: RefinementCtx,
): void {
  const key = String(this);
  const alreadyMet: Record<string, true> = {};
  const duplicatedElementIndex = values.findIndex((value) => {
    const propertyValue = value[key];

    if (typeof propertyValue !== 'string') {
      return false;
    }

    const trimmedPropertyValue = propertyValue.trim().toLowerCase();

    if (alreadyMet[trimmedPropertyValue]) {
      return true;
    }

    alreadyMet[trimmedPropertyValue] = true;

    return false;
  });

  if (duplicatedElementIndex === -1) {
    return;
  }

  context.addIssue({
    code: 'custom',
    path: [duplicatedElementIndex, 'title'],
    message: `Property "${key}" should be unique!`,
  });
}
