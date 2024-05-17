import { faker } from '@faker-js/faker';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@storybook/test';

import { ActionPanel, ActionPanelProps } from './action-panel';

faker.seed(0);

const eventProps: Omit<ActionPanelProps, 'status'> = {
  onRevert: action('onRevert'),
  onStartBot: action('onStartBot'),
  onStatusCheck: action('onStatusCheck'),
  onStopBot: action('onStopBot'),
  onUpdate: action('onUpdate'),
};

const Story: Meta<typeof ActionPanel> = {
  component: ActionPanel,
  title: 'Bot Subscription Seller/ActionPanel',
  parameters: {
    layout: 'centered',
  },
};

export default Story;

export const Loading: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    status: 'loading',
  },
};

export const RunningUnchanged: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    arePreferencesChanged: false,
    status: 'running',
  },
};

export const RunningRequestProcessing: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    arePreferencesChanged: false,
    isRequestProcessing: true,
    status: 'running',
  },
};

export const RunningChanged: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    arePreferencesChanged: true,
    status: 'running',
  },
};

export const StoppedUnchanged: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    arePreferencesChanged: false,
    status: 'stopped',
  },
};

export const StoppedChanged: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    arePreferencesChanged: true,
    status: 'stopped',
  },
};

export const StoppedAfterFailedStart: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    arePreferencesChanged: true,
    errorMessage: 'Unfortunately, bot was unable to start. Try again later.',
    status: 'stopped',
  },
};

export const StoppedAfterFailedStartWithErrorDetails: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    arePreferencesChanged: true,
    errorMessage: 'Bot start failed',
    errorDetails: [
      {
        path: 'paymentToken',
        message: 'This payment token is wrong!',
        value: faker.string.numeric(10),
      },
      {
        path: 'privateChannelID',
        message: 'Bot can\'t find channel with this ID. Is it real?',
        value: faker.string.numeric(10),
      },
    ],
    status: 'stopped',
  },
};

export const StoppedRequestProcessing: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    isRequestProcessing: true,
    status: 'stopped',
  },
};

export const CheckFailedUnchanged: StoryObj<typeof ActionPanel> = {
  args: {
    ...eventProps,
    arePreferencesChanged: false,
    errorMessage: 'Check is failed! Try to restart bot and contact us.',
    status: 'check-failed',
  },
};
