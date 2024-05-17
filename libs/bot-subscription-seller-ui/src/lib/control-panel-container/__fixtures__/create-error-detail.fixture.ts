import { faker } from '@faker-js/faker';

import { ErrorDetail } from '../../error-detail';
import {
  PreferencesFormValueValidated,
} from '../control-panel-container';

export function createErrorDetailFixture(
  formValue: PreferencesFormValueValidated,
  field?: keyof PreferencesFormValueValidated,
): ErrorDetail {
  const formFields = Object.keys(
    formValue,
  ) as Array<keyof PreferencesFormValueValidated>;
  const path = field ?? faker.helpers.arrayElement(formFields);

  return {
    path,
    message: faker.lorem.sentences(1),
    value: formValue[path],
  };
}
