import { faker } from '@faker-js/faker';
import Box from '@mui/joy/Box';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn } from '@storybook/test';

import {
  ControlPanel,
  ControlPanelProps,
} from './control-panel';
import {
  createDraftFixture,
} from '../draft-list/__fixtures__';
import { createFilledFormValueFixture } from '../preferences-form/__fixtures__';

faker.seed(0);

const draftFixture = createDraftFixture(
  createFilledFormValueFixture,
);

const createEventHandlers = (): Partial<ControlPanelProps> => ({
  onChange: fn(),
  onSelectDraft: fn(),
  onStartBot: fn(),
  onStopBot: fn(),
  onUpdateBot: fn(),
  onUpdateDrafts: fn(),
});

const Story: Meta<typeof ControlPanel> = {
  component: ControlPanel,
  title: 'Bot Subscription Seller/ControlPanel',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (OriginalStory) => (
      <Box sx={{ padding: '1rem' }}>
        <OriginalStory />
      </Box>
    ),
  ],
  argTypes: {
    status: {
      control: 'select',
      options: [
        'loading',
        'stopped',
      ],
    },
  },
};

export default Story;

export const Loading: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    status: 'loading',
  },
};

export const StoppedAndNeverStarted: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    status: 'stopped',
  },
};

export const StoppedHavingFirstDraft: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    draftHighlight: {
      draftUuid: draftFixture.uuid,
      text: 'Your previous valid state was saved here. Click it to fill form from draft.',
      color: 'primary',
    },
    drafts: [
      draftFixture,
    ],
    status: 'stopped',
  },
};

export const StoppedRequestingStart: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    isRequestProcessing: true,
    status: 'stopped',
    value: createFilledFormValueFixture(),
  },
};

export const StoppedAfterFailedStart: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    draftHighlight: {
      draftUuid: draftFixture.uuid,
      text: 'Your changes were saved to this draft after failed launch',
      color: 'warning',
    },
    drafts: [
      draftFixture,
    ],
    selectedDraft: draftFixture.uuid,
    status: 'stopped',
    errorMessage: 'Unfortunately, bot was unable to start. Try again later.',
    value: createFilledFormValueFixture(),
  },
};

export const StoppedAfterFailedStartWithDetails: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    draftHighlight: {
      draftUuid: draftFixture.uuid,
      text: 'Your changes were saved to this draft after failed launch',
      color: 'warning',
    },
    drafts: [
      draftFixture,
    ],
    errorDetails: [
      {
        path: 'paymentToken',
        message: 'This payment token is wrong!',
        value: draftFixture.payload.paymentToken,
      },
      {
        path: 'privateChannelID',
        message: 'Bot can\'t find channel with this ID. Is it real?',
        value: draftFixture.payload.privateChannelID,
      },
    ],
    selectedDraft: draftFixture.uuid,
    status: 'stopped',
    errorMessage: 'Bot launch failed with errors',
    value: draftFixture.payload,
  },
};

export const RunningUnchanged: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    status: 'running',
    value: createFilledFormValueFixture(),
  },
};

export const RunningHavingDrafts: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    draftHighlight: {
      draftUuid: draftFixture.uuid,
      text: (
        <>
          <strong>Your previous form state was saved here</strong>
          <br />
          Actual state of your bot was changed.
          Form also was forced to pull actual value from server.
        </>
      ),
      color: 'warning',
    },
    drafts: [
      draftFixture,
      createDraftFixture(
        createFilledFormValueFixture,
      ),
      createDraftFixture(
        createFilledFormValueFixture,
      ),
    ],
    status: 'running',
    value: createFilledFormValueFixture(),
  },
};

export const RunningRequestingUpdateOrOtherAction: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    drafts: [
      draftFixture,
    ],
    isRequestProcessing: true,
    status: 'running',
    value: createFilledFormValueFixture(),
  },
};

export const RunningAfterFailedUpdateWithDetails: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    draftHighlight: {
      draftUuid: draftFixture.uuid,
      text: 'Your changes were saved to this draft after failed update',
      color: 'warning',
    },
    drafts: [
      draftFixture,
    ],
    errorDetails: [
      {
        path: 'paymentToken',
        message: 'This payment token is wrong!',
        value: draftFixture.payload.paymentToken,
      },
      {
        path: 'privateChannelID',
        message: 'Bot can\'t find channel with this ID. Is it real?',
        value: draftFixture.payload.privateChannelID,
      },
    ],
    status: 'running',
    errorMessage: 'Update was canceled due the errors',
    value: draftFixture.payload,
  },
};
RunningAfterFailedUpdateWithDetails.play = async ({ args, step }) => {
  await step('Check correct event emissions', async () => {
    await expect(args.onChange).not.toHaveBeenCalled();
  });
};

export const CheckFailed: StoryObj<typeof ControlPanel> = {
  args: {
    ...createEventHandlers(),
    status: 'check-failed',
    errorMessage: 'Check failed! Try to stop bot and relaunch later.',
    value: createFilledFormValueFixture(),
  },
};
