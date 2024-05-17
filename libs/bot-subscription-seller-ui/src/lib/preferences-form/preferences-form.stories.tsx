import { faker } from '@faker-js/faker';
import Box from '@mui/joy/Box';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import {
  expect,
  fn,
  isMockFunction,
  userEvent,
  waitFor,
  within,
} from '@storybook/test';
import { useEffect, useMemo } from 'react';
import { Subject } from 'rxjs';

import { createFilledFormValueFixture } from './__fixtures__';
import {
  PreferencesForm,
  PreferencesFormGripAction,
} from './preferences-form';
import {
  preferencesFormDefaultValues,
  PreferencesFormValueValidator,
} from './preferences-form-value';

faker.seed(0);

const filledFormValueFixture = createFilledFormValueFixture();

const Story: Meta<typeof PreferencesForm> = {
  component: PreferencesForm,
  title: 'Bot Subscription Seller / Preferences Form',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (OriginalStory) => (
      <Box sx={{ maxWidth: '1000px' }}>
        <OriginalStory />
      </Box>
    ),
  ],
};

export default Story;

export const DefaultValue: StoryObj<typeof PreferencesForm> = {
  args: {
    onChange: action('onChange'),
    onValidationStatusChange: action('onValidationStatusChange'),
    onSubmitFail: action('onSubmitFail'),
    onSuccessfullySubmitted: action('onSuccessfullySubmitted'),
  },
};

export const Empty: StoryObj<typeof PreferencesForm> = {
  args: {
    onChange: action('onChange'),
    onValidationStatusChange: action('onValidationStatusChange'),
    onSubmitFail: action('onSubmitFail'),
    onSuccessfullySubmitted: action('onSuccessfullySubmitted'),
    value: {
      availablePrices: [
      ],
    },
  },
};

export const Filled: StoryObj<typeof PreferencesForm> = {
  args: {
    onChange: action('onChange'),
    onSubmitFail: action('onSubmitFail'),
    onSuccessfullySubmitted: action('onSuccessfullySubmitted'),
    onValidationStatusChange: action('onValidationStatusChange'),
    value: {
      ...filledFormValueFixture,
    },
  },
};

export const FilledWithCustomError: StoryFn<typeof PreferencesForm> = (args) => {
  const formGrip = useMemo(
    () => new Subject<PreferencesFormGripAction>(),
    [],
  );
  const wrongPrivateChannelID = useMemo(
    () => filledFormValueFixture.privateChannelID,
    [],
  );

  useEffect(() => {
    formGrip.next({
      type: 'registerWrongValue',
      payload: {
        path: 'privateChannelID',
        value: wrongPrivateChannelID,
        message: `"${wrongPrivateChannelID}" is a wrong channel ID! Please, set proper value!`,
      },
    });

    setTimeout(
      () => formGrip.next({ type: 'submit' }),
      200,
    );
  }, [
    formGrip,
    wrongPrivateChannelID,
  ]);

  return (
    <PreferencesForm {...args} formGrip={formGrip} />
  );
};
FilledWithCustomError.args = {
  onChange: action('onChange'),
  onSubmitFail: action('onSubmitFail'),
  onSuccessfullySubmitted: action('onSuccessfullySubmitted'),
  onValidationStatusChange: action('onValidationStatusChange'),
  value: {
    ...filledFormValueFixture,
  },
};

export const Disabled: StoryObj<typeof PreferencesForm> = {
  args: {
    disabled: true,
    onChange: action('onChange'),
    onSubmitFail: action('onSubmitFail'),
    onSuccessfullySubmitted: action('onSuccessfullySubmitted'),
    onValidationStatusChange: action('onValidationStatusChange'),
    value: {
      ...filledFormValueFixture,
    },
  },
};

export const Loading: StoryObj<typeof PreferencesForm> = {
  args: {
    disabled: true,
    isLoading: true,
    onChange: action('onChange'),
    onSubmitFail: action('onSubmitFail'),
    onSuccessfullySubmitted: action('onSuccessfullySubmitted'),
    onValidationStatusChange: action('onValidationStatusChange'),
    value: {
      ...filledFormValueFixture,
    },
  },
};

export const ScenarioFirstTimeFilling: StoryObj<typeof PreferencesForm> = {
  args: {
    onChange: fn(),
    onValidationStatusChange: fn(),
    onSubmitFail: fn(),
    onSuccessfullySubmitted: fn(),
    formGrip: new Subject(),
  },
};
ScenarioFirstTimeFilling.storyName = '▶️ Scenario / First Time Filling';
ScenarioFirstTimeFilling.play = async ({
  args,
  canvasElement,
  step,
}) => {
  // typeguarding
  if (!args) {
    throw new Error('args should be set!');
  }

  const {
    onChange,
    onSuccessfullySubmitted,
    onValidationStatusChange,
    formGrip,
  } = args;

  const {
    publicName,
    publicToken,
    privateChannelID,
    paymentToken,
  } = filledFormValueFixture;

  // infer type of `onValidationStatusChange` mock
  if (!isMockFunction(onValidationStatusChange)) {
    throw new Error('onValidationStatusChange should be mock!');
  }

  // infer type of `onSuccessfullySubmitted` mock
  if (!isMockFunction(onSuccessfullySubmitted)) {
    throw new Error('onSuccessfullySubmitted should be mock!');
  }

  await step('Should emit first validation event', async () => {
    await waitFor(
      () => expect(onValidationStatusChange)
        .toHaveBeenCalledOnce(),
    );
  });

  await step('Should NOT emit onChange at init', async () => {
    await waitFor(
      () => expect(onChange)
        .not
        .toHaveBeenCalled(),
    );
  });

  const canvas = within(canvasElement);
  const publicNameTextBox = await canvas.findByRole('textbox', {
    name: 'Public name of channel',
  });

  await step('Should get invalid after empty field blur', async () => {
    await userEvent.click(publicNameTextBox);
    await userEvent.click(canvasElement);

    await expect(publicNameTextBox.getAttribute('aria-invalid')).toBe('true');
  });

  await step('Fill out invalid field to make it valid', async () => {
    await userEvent.type(
      publicNameTextBox,
      publicName,
    );
    await expect(publicNameTextBox.getAttribute('aria-invalid')).toBeFalsy();
  });

  await step('Fill out other invalid fields', async () => {
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Public token' }),
      publicToken,
    );
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Private channel ID' }),
      privateChannelID,
    );
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Payment token' }),
      paymentToken,
    );

    await waitFor(
      () => expect(onChange)
        .toHaveBeenLastCalledWith({
          ...preferencesFormDefaultValues,
          publicName,
          publicToken,
          privateChannelID,
          paymentToken,
        }),
    );
    // should inform about completely valid groups
    await waitFor(
      () => expect(onValidationStatusChange.mock.lastCall)
        .toMatchObject([
          Array.from({ length: 4 }).map(
            () => ({ isValid: true }),
          ),
        ]),
    );
  });

  await step('Submit valid form', async () => {
    (formGrip as Subject<PreferencesFormGripAction>).next({
      type: 'submit',
    });

    await waitFor(
      // ensures the result is valid data
      async () => {
        const result = onSuccessfullySubmitted.mock.lastCall;

        await expect(PreferencesFormValueValidator.parse(result?.[0])).toBeTruthy();
      },
    );
  });
};
