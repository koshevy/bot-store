import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Stack from '@mui/joy/Stack';
import {
  FieldPath,
  FieldPathValue,
} from 'react-hook-form';

import { MarkdownRendererMemo } from './markdown-renderer';
import { NonNever } from './non-never';
import { WidgetMetaWithLabel } from './widget-meta-with-label';
import { WidgetRenderer } from './widget-renderer';

export function HorizontalFormItem<
  TFieldType extends string = string,
  TAdditionalProps extends Record<string, unknown> = never,
  TFormValue extends Record<string, unknown> = Record<string, never>,
  TFieldPath extends FieldPath<TFormValue> = NonNever<FieldPath<TFormValue>>,
  TFieldValue = NonNever<FieldPathValue<TFormValue, TFieldPath>>,
>({
  hint,
  label,
  multiInput,
  ...widgetProps
}: WidgetMetaWithLabel<
TFieldType,
TAdditionalProps,
TFormValue,
TFieldPath,
TFieldValue
>) {
  const content = (
    <>
      <FormLabel>{label}</FormLabel>
      <WidgetRenderer {...widgetProps} />
      <MarkdownRendererMemo
        text={hint}
        wrapperTextLevel="body-sm"
      />
    </>
  );

  if (multiInput) {
    return (
      <Stack direction="column" spacing={1}>
        {content}
      </Stack>
    );
  }

  return <FormControl>{content}</FormControl>;
}
