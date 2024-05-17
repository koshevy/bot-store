import Alert from '@mui/joy/Alert';
import Box from '@mui/joy/Box';
import Tooltip, { TooltipProps } from '@mui/joy/Tooltip';
import {
  FocusEvent, memo, useCallback, useContext, useMemo,
} from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldPathValue,
  Path,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';

import { DefaultErrorMessagesContext } from './default-error-messages';
import { mapRawErrorToString } from './map-raw-error-to-string';
import { NonNever } from './non-never';
import { WidgetMetaContext } from './widget-meta';

type Rules = Omit<
RegisterOptions<any, any>,
| 'valueAsNumber'
| 'valueAsDate'
| 'setValueAs'
| 'disabled'
>;

export interface WidgetRendererProps<
  TFieldType extends string = string,
  TAdditionalProps extends Record<string, unknown> = Record<string, unknown>,
  TFormValue extends Record<string, unknown> = Record<string, unknown>,
  TFieldPath extends FieldPath<TFormValue> = NonNever<FieldPath<TFormValue>>,
  TFieldValue = NonNever<FieldPathValue<TFormValue, TFieldPath>>,
> {
  disabled?: boolean;
  defaultValue?: TFieldValue;
  errorTooltipOptions?: Partial<TooltipProps>;
  extendedProps?: TAdditionalProps;
  /**
   * Marks widget as having few inputs to avoid
   * placing into FormControl
   */
  multiInput?: boolean;
  name: NonNever<TFieldPath>;
  rules?: Rules;
  shouldUnregister?: boolean;
  type: TFieldType;
}

export const defaultErrorTooltipOptions: Partial<TooltipProps> = {
  color: 'danger',
  placement: 'bottom-start',
  variant: 'soft',
};

export const defaultRules: Rules = {
  shouldUnregister: true,
};

export function WidgetRendererRaw<
  TFieldType extends string = string,
  TAdditionalProps extends Record<string, unknown> = never,
  TFormValue extends Record<string, unknown> = Record<string, unknown>,
  TFieldPath extends FieldPath<TFormValue> = NonNever<FieldPath<TFormValue>>,
  TFieldValue = NonNever<FieldPathValue<TFormValue, TFieldPath>>,
>({
  defaultValue,
  disabled,
  errorTooltipOptions = defaultErrorTooltipOptions,
  extendedProps,
  name,
  rules,
  type,
}: WidgetRendererProps<
TFieldType,
TAdditionalProps,
TFormValue,
TFieldPath,
TFieldValue
>) {
  const defaultErrorMessages = useContext(DefaultErrorMessagesContext);
  const { [type]: widgetMeta } = useContext(WidgetMetaContext);
  const mergedRules = useMemo(() => ({
    ...defaultRules,
    ...rules,
  }), [rules]);

  if (!widgetMeta) {
    throw new Error(`Unknown control type: ${type}`);
  }

  const { control } = useFormContext<
  TFormValue,
  Path<TFormValue>
  >();

  const {
    widget: {
      arePropsValid,
      Constructor,
      defaultProps,
      defaultValue: defaultValueFromConfig,
      mapError,
      noBuiltInErrorTooltip,
    },
  } = widgetMeta;

  const handleFocusCapture = useCallback(({ currentTarget, target }: FocusEvent) => {
    if (target !== currentTarget) {
      return;
    }

    currentTarget.querySelector<HTMLInputElement>('input, [contenteditable]')?.focus();
  }, []);

  const renderWidget: ControllerProps<
  TFormValue, Path<TFormValue>
  >['render'] = useCallback(({
    field, fieldState: {
      error,
      isTouched,
      isDirty,
    },
  }) => {
    const highlightError = (isTouched || isDirty) && !!error;
    const constructorProps = {
      'aria-invalid': !!error,
      disabled,
      onFocusCapture: handleFocusCapture,
      tabIndex: 0,
      ...defaultProps,
      ...field,
      ...extendedProps,
      error: highlightError,
      ...mapError && error ? {
        errorDetails: mapError(error, field.value),
      } : {},
    };
    const errorMessage = highlightError
      ? (mapRawErrorToString(error, defaultErrorMessages)?.message ?? '')
      : '';

    if (arePropsValid?.(constructorProps) === false) {
      return (
        <Alert color="danger">
          Props of the
          {' '}
          <code>{type}</code>
          {' '}
          widget are invalid
        </Alert>
      );
    }

    if (noBuiltInErrorTooltip) {
      return (
        <Constructor {...constructorProps} />
      );
    }

    return (
      <Tooltip
        {...errorTooltipOptions}
        title={errorMessage}
        disablePortal
      >
        <Box>
          <Constructor {...constructorProps} />
        </Box>
      </Tooltip>
    );
  }, [
    arePropsValid,
    Constructor,
    defaultErrorMessages,
    defaultProps,
    disabled,
    errorTooltipOptions,
    extendedProps,
    handleFocusCapture,
    mapError,
    noBuiltInErrorTooltip,
    type,
  ]);

  return (
    <Controller<TFormValue>
      defaultValue={defaultValue ?? defaultValueFromConfig}
      name={name}
      control={control}
      rules={mergedRules}
      render={renderWidget}
    />
  );
}

export const WidgetRenderer = memo(WidgetRendererRaw);
