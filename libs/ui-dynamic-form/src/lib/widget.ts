import { JSXElementConstructor } from 'react';
import {
  ControllerRenderProps,
  FieldPath,
} from 'react-hook-form';

import { NonNever } from './non-never';

export interface ControlWidgetProps<
  TAdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  TError = unknown,
  TFormValue extends Record<string, unknown> = Record<string, unknown>,
  TFieldPath extends NonNever<FieldPath<TFormValue>> = NonNever<FieldPath<TFormValue>>,
> extends ControllerRenderProps <TFormValue, TFieldPath> {
  error?: boolean;
  errorDetails?: TError;
  extendedProps?: TAdditionalProps;
}

export type ControlWidgetConstructor<
  TAdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  TFormValue extends Record<string, unknown> = Record<string, unknown>,
  TFieldPath extends NonNever<FieldPath<TFormValue>> = NonNever<FieldPath<TFormValue>>,
  TError = unknown,
> = JSXElementConstructor<
ControlWidgetProps<
TAdditionalProps,
TError,
TFormValue,
TFieldPath
>
>;
