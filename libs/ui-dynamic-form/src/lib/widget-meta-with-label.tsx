import {
  FieldPath,
  FieldPathValue,
  FieldValues,
} from 'react-hook-form';

import { NonNever } from './non-never';
import { WidgetRendererProps } from './widget-renderer';

export interface WidgetMetaWithLabel<
  TFieldType extends string = string,
  TAdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  TFormValue extends FieldValues = FieldValues,
  TFieldPath extends FieldPath<TFormValue> = NonNever<FieldPath<TFormValue>>,
  TFieldValue = NonNever<FieldPathValue<TFormValue, TFieldPath>>,
> extends WidgetRendererProps<
  TFieldType,
  TAdditionalProps,
  TFormValue,
  TFieldPath,
  TFieldValue
  > {
  /**
   * String of array of string supporting [Markdown](https://marked.js.org/demo/)
   */
  hint?: string | string[];
  group?: string;
  label: string;
}
