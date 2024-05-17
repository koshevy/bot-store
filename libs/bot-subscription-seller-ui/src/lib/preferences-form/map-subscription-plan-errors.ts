import { ZodIssue } from 'zod';

import {
  SubscriptionPlanMultiEditorError as PlanErrors,
  SubscriptionPlanMultiEditorProps as Props,
} from '../subscription-plan-multi-editor';

type FieldValue = Props['value'];

export function mapSubscriptionPlanErrors(
  error: unknown,
  value: unknown,
): PlanErrors | undefined {
  if (!error) {
    return undefined;
  }

  if (!isZodIssues(error)) {
    return { root: error };
  }

  return Object.keys(error).reduce<Record<string, PlanErrors>>(
    (result, position) => {
      if (!isFieldValue(value)) {
        return result;
      }

      const relatedValue = value[Number(position)];
      const curError = error[Number(position)];

      if (!relatedValue) {
        return result;
      }

      // todo fix type errors
      // eslint-disable-next-line no-param-reassign
      result[relatedValue.uuid] = curError as any;

      return result;
    },
    {},
  );
}

export function isZodIssues(value: unknown): value is Array<ZodIssue> {
  return Array.isArray(value) && !!value.length;
}

export function isFieldValue(value: unknown): value is FieldValue {
  return Array.isArray(value) && !!value.length && ('uuid' in value[0]);
}
