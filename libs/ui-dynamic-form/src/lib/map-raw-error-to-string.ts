import {
  FieldError,
  GlobalError,
} from 'react-hook-form';

export function mapRawErrorToString(
  rawError: Partial<GlobalError | FieldError> | undefined | null,
  defaultErrorMessages: Record<string, string>,
): GlobalError | undefined {
  return rawError
    ? {
      type: rawError.type ?? 'unknown',
      message: rawError.message
        || defaultErrorMessages[String(rawError.type)]
        || 'Invalid value',
    }
    : undefined;
}
