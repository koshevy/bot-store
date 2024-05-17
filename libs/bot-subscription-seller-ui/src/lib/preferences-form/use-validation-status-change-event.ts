import { WidgetMetaWithLabel } from '@bot-store/ui-dynamic-form';
import {
  JSXElementConstructor,
  Ref,
  useEffect,
  useRef,
} from 'react';
import {
  FieldErrors,
  FieldValues,
  UseFormTrigger,
} from 'react-hook-form';

import { FieldGroupStatus } from './field-group-status';
import { preferencesFormFields } from './preferences-form-fields';
import { PreferencesFormValue } from './preferences-form-value';

export interface UseValidationStatusChangeEventProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  errors: FieldErrors<TFieldValues>;
  groupIcons: Record<string, JSXElementConstructor<unknown>>;
  groupRefs?: Record<string, Ref<HTMLDivElement | null> | null> | null;
  /**
   * This event will be fired every time when
   * summary validation status gets changed.
   */
  onValidationStatusChange?: (
    fieldGroupStatusMap: FieldGroupStatus[],
  ) => void;
  trigger: UseFormTrigger<TFieldValues>;
  value?: PreferencesFormValue;
}

export function useValidationStatusChangeEvent<
  TFieldValues extends FieldValues = FieldValues,
>({
  errors,
  groupIcons,
  groupRefs,
  onValidationStatusChange,
  trigger,
  value,
}: UseValidationStatusChangeEventProps<TFieldValues>): void {
  const skippedFirstValidationStatus = useRef(false);

  const erroredFields = Object.keys(errors);
  const erroredFieldsKey = erroredFields.join(',');

  useEffect(() => {
    trigger(undefined, {
      shouldFocus: false,
    });
  }, [
    trigger,
    value,
  ]);

  useEffect(() => {
    if (!skippedFirstValidationStatus.current) {
      skippedFirstValidationStatus.current = true;

      return;
    }

    onValidationStatusChange?.(
      reduceToFieldGroupStatus(
        errors,
        preferencesFormFields,
        groupIcons,
        groupRefs,
      ),
    );
  }, [
    errors,
    erroredFieldsKey,
    groupIcons,
    groupRefs,
    onValidationStatusChange,
  ]);
}

export function reduceToFieldGroupStatus<
  TFieldValues extends FieldValues = FieldValues,
>(
  errors: FieldErrors<TFieldValues>,
  allFormFields: WidgetMetaWithLabel[],
  groupIcons: Record<string, JSXElementConstructor<unknown>>,
  groupRefs?: Record<string, Ref<HTMLDivElement | null> | null> | null,
): FieldGroupStatus[] {
  const groupMap = allFormFields.reduce<
  Record<string, any>
  >(
    (result, { group, name }) => {
      if (!group) {
        return result;
      }

      if (errors[name]) {
        // eslint-disable-next-line no-param-reassign
        result[group] = {
          isValid: false,
          ...errors[name],
        };
      } else if (!result[group]) {
        // eslint-disable-next-line no-param-reassign
        result[group] = {
          isValid: true,
        };
      }

      return result;
    },
    {},
  );

  const focusToErrorInputInGroup = (group: string) => {
    const subRef = groupRefs?.[group];

    if (!subRef || typeof subRef === 'function') {
      return;
    }

    const element = subRef.current;
    const foundErroredInput = element
      ?.querySelector<HTMLInputElement>('[aria-invalid="true"]');

    (foundErroredInput ?? element)?.focus();
  };

  return Object.keys(groupMap).map(
    (group) => ({
      title: group,
      Icon: groupIcons[group],
      ...groupMap[group],
      // can overwrite ref with options of concrete field
      ref: groupMap[group]?.ref || { focus: () => focusToErrorInputInGroup(group) },
    }),
  );
}
