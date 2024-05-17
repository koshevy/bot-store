import { faker } from '@faker-js/faker';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { useState } from 'react';

import {
  createSubscriptionPlanFixture,
  createEmptySubscriptionPlanFixture,
  nonStable__uuidGeneratorFn,
} from './subscription-plan/__fixtures__';
import {
  SubscriptionPlanMultiEditor,
  SubscriptionPlanMultiEditorProps,
} from './subscription-plan-multi-editor';

faker.seed(0);

const Story: Meta<typeof SubscriptionPlanMultiEditor> = {
  component: SubscriptionPlanMultiEditor,
  title: 'UI-Kit Candidates/SubscriptionPlanMultiEditor',
};

export default Story;

const ControlledComponentTemplate: StoryFn<SubscriptionPlanMultiEditorProps> = ({
  onChange,
  value,
  ...args
}) => {
  const [
    actualValue,
    setActualValue,
  ] = useState(value);

  return (
    <SubscriptionPlanMultiEditor
      {...args}
      value={actualValue}
      onChange={(newValue) => {
        setActualValue(newValue);
        onChange(newValue);
      }}
    />
  );
};

export const EmptyStateNonControlled: StoryObj<typeof SubscriptionPlanMultiEditor> = {
  args: {
    value: [],
    disabled: false,
    maxPlans: 5,
    errorDetails: {},
    onBlur: action('onBlur'),
    onChange: action('onChange'),
  },
};

export const EmptyStateControlled = ControlledComponentTemplate.bind({});
EmptyStateControlled.args = {
  value: [],
  disabled: false,
  maxPlans: 5,
  errorDetails: {},
  onBlur: action('onBlur'),
  onChange: action('onChange'),
};

export const DisabledNonControlled: StoryObj<typeof SubscriptionPlanMultiEditor> = {
  args: {
    value: [
      createSubscriptionPlanFixture('days'),
      createSubscriptionPlanFixture('weeks'),
    ],
    disabled: true,
    maxPlans: 5,
    onBlur: action('onBlur'),
    onChange: action('onChange'),
    nonStable__uuidGeneratorFn,
  },
};

export const ErroredNonControlled: StoryObj<typeof SubscriptionPlanMultiEditor> = {
  args: {
    value: [],
    disabled: false,
    maxPlans: 5,
    errorDetails: {
      [nonStable__uuidGeneratorFn(0)]: {
        title: {
          message: 'Title can\'t be empty!',
        },
        cost: {
          message: 'Cost should be set too!',
        },
      },
    },
    onBlur: action('onBlur'),
    onChange: action('onChange'),
    nonStable__uuidGeneratorFn,
  },
};

export const ErroredFilledControlled = ControlledComponentTemplate.bind({});
ErroredFilledControlled.args = {
  value: [
    createEmptySubscriptionPlanFixture(0),
    createEmptySubscriptionPlanFixture(1),
  ],
  disabled: false,
  maxPlans: 5,
  errorDetails: {
    [nonStable__uuidGeneratorFn(1)]: {
      title: {
        message: 'Title can\'t be empty!',
      },
      cost: {
        message: 'Cost should be set too!',
      },
    },
  },
  onBlur: action('onBlur'),
  onChange: action('onChange'),
  nonStable__uuidGeneratorFn,
};

export const FilledWithDifferentCasesNonControlled: StoryObj<typeof SubscriptionPlanMultiEditor> = {
  args: {
    value: [
      createSubscriptionPlanFixture('days'),
      createSubscriptionPlanFixture('weeks'),
      createSubscriptionPlanFixture('months'),
      createSubscriptionPlanFixture('infinity'),
      createSubscriptionPlanFixture('infinityOverPeriod'),
    ],
    disabled: false,
    maxPlans: 10,
    errorDetails: {},
    onBlur: action('onBlur'),
    onChange: action('onChange'),
  },
};

export const FilledWithDifferentCasesControlled = ControlledComponentTemplate.bind({});
FilledWithDifferentCasesControlled.args = {
  ...FilledWithDifferentCasesNonControlled.args,
};
