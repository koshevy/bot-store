import { useEffect, useCallback, useState } from 'react';
import {
  FieldValues,
  UseFormWatch,
} from 'react-hook-form';

import { WidgetRendererProps } from './widget-renderer';

export interface UseTrackDynamicValueProps<TFormValue extends FieldValues = FieldValues> {
  fields: WidgetRendererProps[];
  getValues: () => TFormValue;
  /**
   * Gets triggered every time when fields or form value
   * are changed, but NOT at init time.
   */
  onUpdate?: (formValue: FieldValues) => void;
  watch: UseFormWatch<TFormValue>;
}

export function useTrackDynamicValue<TFormValue extends FieldValues = FieldValues>({
  fields,
  getValues,
  onUpdate,
  watch,
}: UseTrackDynamicValueProps<TFormValue>) {
  const [mutableState] = useState({ isInitialised: false });

  useEffect(() => {
    if (!onUpdate) {
      return undefined;
    }

    const subscription = watch((formValue) => {
      if (mutableState.isInitialised) {
        onUpdate(formValue);
      }
    });

    return () => subscription.unsubscribe();
  }, [
    fields,
    mutableState,
    onUpdate,
    watch,
  ]);

  // updates value every time fields are changed,
  // but not at first time
  useEffect(() => {
    if (!onUpdate) {
      return;
    }

    if (mutableState.isInitialised) {
      onUpdate(getValues());
    } else {
      mutableState.isInitialised = true;
    }
  }, [
    onUpdate,
    fields,
    mutableState,
    getValues,
  ]);

  /**
   * Allow to reset without excessive rendering
   * the `isInitialised` in order to avoid infinity loop
   * when input form value is changed.
   */
  const resetIsInitialised = useCallback(
    () => { mutableState.isInitialised = false; },
    [mutableState],
  );

  return {
    resetIsInitialised,
  };
}
