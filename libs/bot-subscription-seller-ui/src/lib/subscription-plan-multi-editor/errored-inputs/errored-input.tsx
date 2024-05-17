import Input, { InputProps, inputClasses } from '@mui/joy/Input';
import { forwardRef } from 'react';

import { ErrorTooltip } from './error-tooltip';

export interface ErroredInputProps extends InputProps {
  errorMessage?: string;
}

export const erroredInputClasses = inputClasses;

export const ErroredInput = forwardRef<
HTMLInputElement,
ErroredInputProps
>(({ errorMessage, ...props }, ref) => (
  <ErrorTooltip title={errorMessage ?? ''}>
    <Input
      {...props}
      error={!!errorMessage}
      tabIndex={0}
      slotProps={{
        input: { ref },
      }}
    />
  </ErrorTooltip>
));
