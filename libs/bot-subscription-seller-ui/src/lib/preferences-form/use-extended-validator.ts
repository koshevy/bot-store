import { useCallback, useMemo } from 'react';
import {
  RefinementCtx,
  ZodEffects,
  ZodObject,
  ZodRawShape,
} from 'zod';

type WrongValueRegistry = Record<
// path
string,
// value —> message
Map<unknown, string>
>;

export type RegisterWrongValue = (
  path: string,
  value: unknown,
  message: string,
) => void;

interface UseExtendedValidatorProps<TValue extends ZodRawShape> {
  baseValidator: ZodObject<TValue>;
}

interface UseExtendedValidatorReturn<TValue extends ZodRawShape> {
  registerWrongValue: RegisterWrongValue;
  validator: ZodEffects<ZodObject<TValue>>;
}

/**
 * This validator allows to extend ZOD validator with custom messages
 * from backend.
 *
 * So you can get highlighted errors
 */
export function useExtendedValidator<TValue extends ZodRawShape>({
  baseValidator,
}: UseExtendedValidatorProps<TValue>): UseExtendedValidatorReturn<
  TValue
  > {
  const wrongValues: WrongValueRegistry = useMemo(() => ({}), []);

  const registerWrongValue: RegisterWrongValue = useCallback((
    path,
    value,
    message,
  ) => {
    if (!wrongValues[path]) {
      wrongValues[path] = new Map<unknown, string>();
    }

    wrongValues[path].set(value, message);
  }, [
    wrongValues,
  ]);

  const validator = useMemo(() => (
    baseValidator.superRefine(checkForWrongValues.bind(wrongValues))
  ), [
    baseValidator,
    wrongValues,
  ]);

  return {
    registerWrongValue,
    validator,
  };
}

function checkForWrongValues<TValue extends ZodRawShape>(
  this: WrongValueRegistry,
  value: TValue,
  context: RefinementCtx,
) {
  const registeredPaths = Object.keys(this);

  registeredPaths.forEach((path) => {
    if (this[path].has(value[path])) {
      context.addIssue({
        code: 'custom',
        message: this[path].get(value[path]),
        path: [path],
      });
    }
  });
}
