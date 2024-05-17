import { faker } from '@faker-js/faker';
import Stack from '@mui/joy/Stack';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryFn } from '@storybook/react';
import {
  FormProvider,
  useForm,
} from 'react-hook-form';

import { dynamicFormFields } from './__fixtures__';
import { defaultWidgetMeta } from './default-widget-meta';
import { DynamicForm, DynamicFormProps } from './dynamic-form';
import { WidgetMetaContext } from './widget-meta';

faker.seed(0);

const Story: Meta<typeof DynamicForm> = {
  title: 'Dynamic Form/DynamicForm',
  component: DynamicForm,
};

export default Story;

export const IntegratedUsageWithReactHookForm: StoryFn<DynamicFormProps> = ({
  formFields,
  ...args
}) => {
  const formContext = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { handleSubmit } = formContext;

  return (
    <WidgetMetaContext.Provider value={defaultWidgetMeta}>
      <form onSubmit={handleSubmit(action('valid'), action('invalid'))}>
        <FormProvider {...formContext}>
          <Stack spacing={1}>
            <DynamicForm
              {...args}
              formFields={formFields}
              onUpdate={action('onUpdate')}
            />
          </Stack>
        </FormProvider>
      </form>
    </WidgetMetaContext.Provider>
  );
};
IntegratedUsageWithReactHookForm.args = {
  formFields: [...dynamicFormFields],
};
