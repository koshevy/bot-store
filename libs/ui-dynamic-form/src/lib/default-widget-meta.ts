import Input, { InputProps } from '@mui/joy/Input';
import Textarea, { TextareaProps } from '@mui/joy/Textarea';

import { ControlWidgetProps } from './widget';
import { WidgetMeta } from './widget-meta';

export type TextControlType =
  | 'text'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'time'
  | 'search'
  | 'password';

type TextFieldAdditionalProps = Partial<InputProps> & Partial<TextareaProps>;
type TextWidgetMeta = WidgetMeta<TextFieldAdditionalProps, unknown, string, Record<string, string>>;

export function areTextWidgetProps(
  props: unknown,
): props is ControlWidgetProps<TextFieldAdditionalProps> & { type: TextControlType } {
  return (typeof props === 'object')
    && !!props
    && 'type' in props
    && typeof props.type === 'string'
    && isDefaultControlType(props.type);
}

export function isDefaultControlType(type: string): type is TextControlType {
  return (type === 'text')
    || (type === 'email')
    || (type === 'number')
    || (type === 'tel')
    || (type === 'url')
    || (type === 'time')
    || (type === 'search')
    || (type === 'password');
}

export const defaultWidgetMeta: Partial<Record<
TextControlType | 'textarea',
TextWidgetMeta
>> = {
  ...(([
    'email',
    'number',
    'password',
    'tel',
    'text',
    'time',
    'search',
    'url',
  ] as const).reduce<TextWidgetMeta>((config, type) => ({
    ...config,
    [type]: {
      widget: {
        arePropsValid: areTextWidgetProps,
        Constructor: Input,
        defaultProps: { type },
        defaultValue: '',
      },
    },
  }), {} as TextWidgetMeta)),
  textarea: {
    widget: {
      Constructor: Textarea,
      defaultProps: {
        minRows: 2,
      },
      defaultValue: '',
    },
  },
};
