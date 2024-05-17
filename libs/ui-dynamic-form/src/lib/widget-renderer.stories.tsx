import { faker } from '@faker-js/faker';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryFn } from '@storybook/react';
import { useMemo, useState } from 'react';
import {
  FormProvider,
  useForm,
} from 'react-hook-form';

import { defaultWidgetMeta } from './default-widget-meta';
import { useTrackDynamicValue } from './use-track-dynamic-value';
import { WidgetMetaContext } from './widget-meta';
import {
  WidgetRenderer,
  WidgetRendererProps,
} from './widget-renderer';

faker.seed(0);

const Story: Meta<typeof WidgetRenderer> = {
  title: 'Dynamic Form/WidgetRenderer',
  argTypes: {
    type: {
      control: 'select',
      name: 'type',
      description: 'Type of form control from your config (See `ControlTypeConfigContext`)',
      defaultValue: 'text',
      options: Object.keys(defaultWidgetMeta),
    },
  },
};

export default Story;

export const RequiredTextField: StoryFn<WidgetRendererProps> = ({
  defaultValue,
  extendedProps,
  name,
  rules,
  type,
}) => {
  const formContext = useForm({
    mode: 'all',
    reValidateMode: 'onChange',
  });

  return (
    <WidgetMetaContext.Provider value={defaultWidgetMeta}>
      <FormProvider {...formContext}>
        <WidgetRenderer
          defaultValue={defaultValue}
          extendedProps={extendedProps}
          name={name}
          rules={rules}
          type={type}
        />
      </FormProvider>
    </WidgetMetaContext.Provider>
  );
};
RequiredTextField.args = {
  defaultValue: '',
  extendedProps: {
    size: 'md',
    fullWidth: true,
    placeholder: 'This is required field',
  },
  name: faker.database.column(),
  rules: {
    required: true,
  },
  type: 'text',
};

export const RequiredFilledTextField = RequiredTextField.bind({});
RequiredFilledTextField.args = {
  ...RequiredTextField.args,
  defaultValue: 'Filled default value',
};

export const TextFieldWithMinLength = RequiredTextField.bind({});
TextFieldWithMinLength.args = {
  ...RequiredTextField.args,
  extendedProps: {
    size: 'md',
    minRows: 4,
    placeholder: 'Text with min length',
  },
  rules: {
    minLength: 32,
  },
  defaultValue: '',
  type: 'textarea',
};

export const RealTimeFormWithDynamicWidgets: StoryFn<{ fields: WidgetRendererProps[] }> = ({
  fields,
}) => {
  type FormValue = Partial<{
    login: string;
    password: string;
  }>;

  const formContext = useForm<FormValue>({
    defaultValues: {
      login: 'name@example.com',
      password: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const {
    handleSubmit,
    getValues,
    watch,
  } = formContext;

  const [
    actualFormValue,
    setActualFormValue,
  ] = useState<FormValue>(() => getValues());

  useTrackDynamicValue<FormValue>({
    fields,
    getValues,
    onUpdate: setActualFormValue,
    watch,
  });

  const renderedFields = useMemo(
    () => fields.map((field) => (
      <Box key={field.name}>
        <WidgetRenderer {...field} />
        <Typography level="body-xs">
          Render ID:
          {' '}
          {faker.string.nanoid()}
        </Typography>
      </Box>
    )),
    [fields],
  );

  return (
    <WidgetMetaContext.Provider value={defaultWidgetMeta}>
      <FormProvider {...formContext}>
        <form onSubmit={handleSubmit(action('submittedValid'), action('submittedInvalid'))}>
          <Stack spacing={2}>
            <Typography level="body-sm">
              Tracking of render IDs change allows you to track excessive
              rendering of fields
            </Typography>
            {renderedFields}
            <Box>
              <Typography level="title-lg">
                Value:
              </Typography>
              <pre>
                <code>
                  {JSON.stringify(actualFormValue, null, 2)}
                </code>
              </pre>
            </Box>
          </Stack>
        </form>
      </FormProvider>
    </WidgetMetaContext.Provider>
  );
};
RealTimeFormWithDynamicWidgets.args = {
  fields: [
    {
      name: 'login',
      type: 'email',
      defaultValue: 'login@example.com',
      extendedProps: {
        placeholder: 'Enter your login',
      },
      rules: {
        required: true,
      },
    },
    {
      name: 'password',
      type: 'password',
      extendedProps: {
        placeholder: 'Enter your password',
      },
      rules: {
        required: true,
      },
    },
  ],
};
