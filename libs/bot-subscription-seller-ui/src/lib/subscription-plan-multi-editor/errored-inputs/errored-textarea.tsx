import Textarea, { TextareaProps } from '@mui/joy/Textarea';
import { forwardRef } from 'react';

import { ErrorTooltip } from './error-tooltip';

export interface ErroredTextareaProps extends TextareaProps {
  errorMessage?: string;
}

export const ErroredTextarea = forwardRef<
HTMLDivElement,
ErroredTextareaProps
>(({ errorMessage, ...props }, ref) => (
  <ErrorTooltip title={errorMessage ?? ''}>
    <Textarea {...props} error={!!errorMessage} ref={ref} />
  </ErrorTooltip>
));
