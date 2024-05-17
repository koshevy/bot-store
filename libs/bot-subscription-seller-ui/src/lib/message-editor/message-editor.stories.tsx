import { faker } from '@faker-js/faker';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { htmlContentFixture } from './__fixtures__';
import { MessageEditor } from './message-editor';

faker.seed(0);
const Story: Meta<typeof MessageEditor> = {
  component: MessageEditor,
  title: 'UI-Kit Candidates/Telegram Message Editor',
  parameters: {
    layout: 'centered',
  },
};

export default Story;

export const Empty: StoryObj<typeof MessageEditor> = {
  args: {
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};

export const Filled: StoryObj<typeof MessageEditor> = {
  args: {
    value: htmlContentFixture,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};

export const Disabled: StoryObj<typeof MessageEditor> = {
  args: {
    disabled: true,
    value: htmlContentFixture,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};

export const Errored: StoryObj<typeof MessageEditor> = {
  args: {
    error: true,
    onChange: action('onChange'),
    onBlur: action('onBlur'),
  },
};

export const FixedSize: StoryObj<typeof MessageEditor> = {
  args: {
    compactMode: true,
    onBlur: action('onBlur'),
    onChange: action('onChange'),
    sx: {
      width: '300px',
      height: '120px',
      overflow: 'auto',
      padding: 0,
    },
    value: htmlContentFixture,
  },
};

export const ControlledEditor: StoryFn<typeof MessageEditor> = ({
  value,
  ...args
}) => {
  const [
    actualValue,
    setActualValue,
  ] = useState(value);

  return (
    <MessageEditor
      {...args}
      onChange={setActualValue}
      value={actualValue}
    />
  );
};
ControlledEditor.args = {
  value: htmlContentFixture,
  onChange: action('onChange'),
  onBlur: action('onBlur'),
};
