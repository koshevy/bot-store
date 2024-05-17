import { createContext } from 'react';
import { FieldPath } from 'react-hook-form';

import { NonNever } from './non-never';
import { ControlWidgetProps, ControlWidgetConstructor } from './widget';

export interface WidgetConstructorAndProps<
  TAdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  TFieldType extends string = string,
  TError = unknown,
  TFormValue extends Record<string, unknown> = Record<string, unknown>,
  TFieldPath extends NonNever<FieldPath<TFormValue>> = NonNever<FieldPath<TFormValue>>,
> {
  arePropsValid?: (meta: unknown) => meta is (ControlWidgetProps<
  TAdditionalProps,
  TError,
  TFormValue,
  TFieldPath
  > & { type: TFieldType });
  Constructor: ControlWidgetConstructor<
  TAdditionalProps,
  TFormValue,
  TFieldPath,
  TError
  >;
  defaultProps?: Partial<TAdditionalProps>;
  defaultValue?: NonNever<TFormValue[TFieldPath]>;
  mapError?: (errorDetails: unknown, value: unknown) => TError;
  noBuiltInErrorTooltip?: boolean;
}

export interface WidgetMeta<
  TAdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  TError = unknown,
  TFieldType extends string = string,
  TFormValue extends Record<string, unknown> = Record<string, unknown>,
  TFieldPath extends NonNever<FieldPath<TFormValue>> = NonNever<FieldPath<TFormValue>>,
> {
  widget: WidgetConstructorAndProps<
  TAdditionalProps,
  TFieldType,
  TError,
  TFormValue,
  TFieldPath
  >;
  description?: string;
}

export const WidgetMetaContext = createContext<
Record<string, WidgetMeta<Record<string, any>, unknown, string, Record<string, any>>>
>({});
