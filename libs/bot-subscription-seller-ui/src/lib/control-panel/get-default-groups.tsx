import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { cloneElement } from 'react';

import { preferencesFormFields } from '../preferences-form';
import { SolidFormStepperProps } from '../solid-form-stepper';

export function getDefaultGroups(): SolidFormStepperProps['steps'] {
  const loadingStepIcon = <HourglassEmptyIcon />;
  const groupsMap = preferencesFormFields.reduce<Record<string, unknown>>((result, field) => {
    // eslint-disable-next-line no-param-reassign
    result[field.group ?? 'Unknown groups'] = true;

    return result;
  }, {});

  return Object.keys(groupsMap).map((group) => ({
    title: group,
    status: 'preparing',
    onClick: () => {},
    icon: cloneElement(loadingStepIcon),
  }));
}
