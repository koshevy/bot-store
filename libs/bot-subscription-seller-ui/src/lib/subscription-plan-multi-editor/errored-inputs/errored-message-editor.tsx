import { forwardRef, HTMLAttributes } from 'react';

import { ErrorTooltip } from './error-tooltip';
import { MessageEditor, MessageEditorProps } from '../../message-editor';

export interface ErroredMessageEditorProps extends MessageEditorProps {
  errorMessage?: string;
}

export const ErroredMessageEditor = forwardRef<
HTMLDivElement,
ErroredMessageEditorProps & Omit<HTMLAttributes<HTMLDivElement>, keyof ErroredMessageEditorProps>
>(({ errorMessage, ...props }, ref) => (
  <ErrorTooltip title={errorMessage ?? ''}>
    <MessageEditor {...props} error={!!errorMessage} ref={ref} />
  </ErrorTooltip>
));
