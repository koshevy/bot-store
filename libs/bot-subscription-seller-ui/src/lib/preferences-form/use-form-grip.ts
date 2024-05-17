import {
  RefObject,
  useEffect,
} from 'react';
import {
  UseFormClearErrors,
  UseFormGetValues,
  UseFormReset,
} from 'react-hook-form';
import { Observable } from 'rxjs';

import {
  PreferencesFormValue,
} from './preferences-form-value';
import type { RegisterWrongValue } from './use-extended-validator';

export type PreferencesFormGripAction = {
  type: 'submit' | 'reset' | 'registerWrongValue';
} & (
  | { type: 'submit'; }
  | { type: 'reset'; }
  | { type: 'registerWrongValue'; payload: {
    path: string;
    value: unknown;
    message: string;
  } }
);

export interface UseFormGripProps {
  clearErrors: UseFormClearErrors<PreferencesFormValue>;
  /**
   * This grip allows you to manage form action in parent component.
   * For example, you can submit or reset form;
   */
  formGrip?: Observable<PreferencesFormGripAction>;
  getValues: UseFormGetValues<PreferencesFormValue>;
  innerRef: RefObject<HTMLFormElement>;
  registerWrongValue: RegisterWrongValue;
  reset: UseFormReset<PreferencesFormValue>;
}

export function useFormGrip({
  clearErrors,
  formGrip,
  getValues,
  innerRef,
  registerWrongValue,
  reset,
}: UseFormGripProps): void {
  useEffect(() => {
    const subscription = formGrip?.subscribe((action) => {
      if (action.type === 'submit') {
        innerRef?.current?.requestSubmit();
      }

      if (action.type === 'reset') {
        reset();
        clearErrors();
      }

      if (action.type === 'registerWrongValue') {
        const { payload } = action;
        const { message, path, value: fieldValue } = payload;

        registerWrongValue(path, fieldValue, message);
      }
    });

    return () => subscription?.unsubscribe();
  }, [
    clearErrors,
    getValues,
    innerRef,
    formGrip,
    registerWrongValue,
    reset,
  ]);
}
