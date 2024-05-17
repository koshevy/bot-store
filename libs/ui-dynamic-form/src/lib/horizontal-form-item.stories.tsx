import { faker } from '@faker-js/faker';
import type { Meta, StoryFn } from '@storybook/react';
import {
  FormProvider,
  useForm,
} from 'react-hook-form';

import { defaultWidgetMeta } from './default-widget-meta';
import { HorizontalFormItem } from './horizontal-form-item';
import { WidgetMetaContext } from './widget-meta';
import { WidgetMetaWithLabel } from './widget-meta-with-label';

faker.seed(0);

const Story: Meta<typeof HorizontalFormItem> = {
  title: 'Dynamic Form/HorizontalFormItem',
};

export default Story;

export const SingleFormItem: StoryFn<WidgetMetaWithLabel> = ({
  defaultValue,
  extendedProps,
  hint,
  label,
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
        <HorizontalFormItem
          defaultValue={defaultValue}
          extendedProps={extendedProps}
          hint={hint}
          name={name}
          rules={rules}
          label={label}
          type={type}
        />
      </FormProvider>
    </WidgetMetaContext.Provider>
  );
};
SingleFormItem.args = {
  defaultValue: '',
  extendedProps: {
    size: 'md',
    fullWidth: true,
    placeholder: 'e.g. https://t.me/c/1907156467/4',
  },
  name: faker.database.column(),
  rules: {
    required: true,
  },
  label: 'ID of private channel',
  hint: `
An easy way to obtain ID of your private channel is to copy
a link to any message in your channel. You can just put the link
here (it should look like \`https://t.me/c/1907156467/4\`.

[Click here](http://botstore.online/) to explore how to copy link of your message.
`,
  type: 'text',
};
