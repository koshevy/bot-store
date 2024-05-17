import {
  DynamicForm,
  DynamicFormGroupRefs,
  WidgetMetaContext,
} from '@bot-store/ui-dynamic-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LinearProgress from '@mui/joy/LinearProgress';
import Stack from '@mui/joy/Stack';
import classNames from 'classnames';
import {
  forwardRef,
  RefCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DeepPartial,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { GroupRenderer } from './group-renderer';
import {
  groupIcons,
  preferencesFormFields,
} from './preferences-form-fields';
import { preferencesFormMeta } from './preferences-form-meta';
import {
  PreferencesFormValue,
  preferencesFormDefaultValues,
  PreferencesFormValueValidated,
  PreferencesFormValueValidator,
} from './preferences-form-value';
import { PreferencesFormStyles } from './preferences-form.styles';
import { useExtendedValidator } from './use-extended-validator';
import {
  useFormGrip,
  UseFormGripProps,
} from './use-form-grip';
import {
  useValidationStatusChangeEvent,
  UseValidationStatusChangeEventProps,
} from './use-validation-status-change-event';

export { PreferencesFormGripAction } from './use-form-grip';

export interface PreferencesFormProps {
  disabled?: boolean;
  /**
   * This grip allows you to manage form action in parent component.
   * For example, you can submit or reset form;
   */
  formGrip?: UseFormGripProps['formGrip'];
  isLoading?: boolean;
  onChange?: (newValue: DeepPartial<PreferencesFormValue>) => void;
  onSubmitFail?: () => void;
  onSuccessfullySubmitted?: (data: PreferencesFormValueValidated) => void;
  onValidationStatusChange?: UseValidationStatusChangeEventProps['onValidationStatusChange'];
  value?: UseValidationStatusChangeEventProps['value'];
}

export const PreferencesForm = forwardRef<
HTMLFormElement,
PreferencesFormProps
>(({
  disabled,
  isLoading,
  onChange,
  onSubmitFail,
  onSuccessfullySubmitted,
  onValidationStatusChange,
  formGrip,
  value = preferencesFormDefaultValues as PreferencesFormValue,
}, ref) => {
  const {
    registerWrongValue,
    validator,
  } = useExtendedValidator({
    baseValidator: PreferencesFormValueValidator,
  });

  const resolver = useMemo(() => zodResolver(validator), [
    validator,
  ]);

  const formContext = useForm({
    mode: 'all',
    resolver,
    reValidateMode: 'onBlur',
    values: value,
  });

  const {
    clearErrors,
    formState: { errors },
    getValues,
    handleSubmit,
    trigger,
    reset,
    watch,
  } = formContext;

  const [
    dynamicGroupsRef,
    setDynamicGroupsRef,
  ] = useState<DynamicFormGroupRefs | null>(null);
  const handleDynamicGroupsRef: RefCallback<DynamicFormGroupRefs | null> = (current) => {
    setDynamicGroupsRef(current);
  };

  useValidationStatusChangeEvent({
    groupIcons,
    groupRefs: dynamicGroupsRef,
    errors,
    onValidationStatusChange,
    trigger,
    value,
  });

  const innerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const subscription = watch((newValue) => {
      onChange?.(newValue);
    });

    return () => subscription.unsubscribe();
  }, [
    onChange,
    watch,
    value,
  ]);

  useFormGrip({
    clearErrors,
    formGrip,
    getValues,
    innerRef,
    registerWrongValue,
    reset,
  });

  useEffect(() => {
    if (ref && typeof ref === 'function') {
      ref(innerRef?.current);
    }
  }, [
    innerRef,
    ref,
  ]);

  const handleSubmitWrapped: SubmitHandler<PreferencesFormValue> = (data) => {
    // recheck value to provide typecast without hacking
    onSuccessfullySubmitted?.(PreferencesFormValueValidator.parse(data));
  };

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <PreferencesFormStyles
      role="form"
      aria-disabled={disabled}
      className={classNames({
        PreferencesForm__isLoading: isLoading,
      })}
      ref={innerRef}
      onSubmit={handleSubmit(handleSubmitWrapped, onSubmitFail)}
    >
      <LinearProgress size="lg" />
      <WidgetMetaContext.Provider value={preferencesFormMeta as any}>
        <FormProvider {...formContext}>
          <Stack className="PreferencesForm__content" spacing={2}>
            <DynamicForm
              disabled={disabled}
              ref={handleDynamicGroupsRef}
              formFields={preferencesFormFields}
              GroupRenderer={GroupRenderer}
            />
          </Stack>
        </FormProvider>
      </WidgetMetaContext.Provider>
    </PreferencesFormStyles>
  );
});
