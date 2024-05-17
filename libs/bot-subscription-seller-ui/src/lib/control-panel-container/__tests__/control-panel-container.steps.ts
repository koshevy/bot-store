import { ReactRenderer } from '@storybook/react';
import {
  expect,
  userEvent,
  waitFor,
  within,
} from '@storybook/test';
import { PlayFunction } from '@storybook/types';

import { createFilledFormValueFixture } from '../../preferences-form/__fixtures__';

const {
  paymentToken,
  privateChannelID,
  publicName,
  publicToken,
} = createFilledFormValueFixture();

export const checkStartConditionStopped: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Check stopped state condition', async () => {
    await waitFor(async () => {
      await expect(
        await canvas.findByRole('button', {
          name: 'Start bot',
        }),
      ).toBeTruthy();
    }, { timeout: 10000 });

    await expect(
      // not using toHaveBeenLength due the bag of Storybook Interactions
      (await canvas.findAllByText('Incomplete')).length,
    ).toBe(2);
  });
};

export const fillMissedValuesStopped: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);
  const rootForm = await canvas.findByRole('form');

  await step('Fill missed values', async () => {
    // wait until it becomes enabled
    await waitFor(async () => {
      await expect(rootForm.ariaDisabled).toBe('false');
    });

    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Public name of channel' }),
      publicName,
    );
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
  });
};

export const checkValidationStatusIsComplete: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Check validation status is complete', async () => {
    await expect(
      // not using toHaveBeenLength due the bag of Storybook Interactions
      (await canvas.findAllByText('Complete')).length,
    ).toBe(4);
  });
};

export const startBot: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Start bot', async () => {
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Start bot',
      }),
    );

    await expect(
      await canvas.findByText('Request processing...'),
    ).toBeTruthy();
  });
};

export const checkUpdateButtonDisabling: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Check update button disabling logic', async () => {
    const updateButton = await canvas.findByRole<HTMLButtonElement>(
      'button',
      { name: 'Update' },
      { timeout: 5000 },
    );

    await expect(updateButton).toBeDisabled();

    const [subscriptionPlanToggleButtons] = await canvas.findAllByRole<HTMLDivElement>(
      'switch',
    );

    // Enable the Update button
    await userEvent.click(subscriptionPlanToggleButtons);
    await expect(updateButton).not.toBeDisabled();

    // Disable the Update button back
    await userEvent.click(subscriptionPlanToggleButtons);
    await expect(updateButton).toBeDisabled();
  });
};

export const updateValueAfterStart: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Update value after start', async () => {
    const [deletePlanButton] = await canvas.findAllByRole<HTMLDivElement>(
      'button',
      { name: 'Remove this subscription plan' },
    );

    await userEvent.click(deletePlanButton);
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Update',
      }),
    );

    await expect(
      await canvas.findByText('Request processing...'),
    ).toBeTruthy();

    const updateButton = await canvas.findByRole<HTMLButtonElement>(
      'button',
      { name: 'Update' },
      { timeout: 5000 },
    );

    await expect(updateButton).toBeDisabled();
  });
};

export const revertChangedValue: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);
  const rootForm = await canvas.findByRole('form');

  await step('Revert changed values', async () => {
    // wait until it becomes enabled
    await waitFor(async () => {
      await expect(rootForm.ariaDisabled).toBe('false');
    });

    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Public name of channel' }),
      ' Copy',
    );

    await userEvent.click(
      await canvas.findByTestId('ArrowDropDownIcon'),
    );

    await userEvent.click(
      await canvas.findByText('Revert changes'),
    );

    const updateButton = await canvas.findByRole<HTMLButtonElement>(
      'button',
      { name: 'Update' },
      { timeout: 5000 },
    );

    await expect(updateButton).toBeDisabled();

    await expect(
      canvas.findByRole<HTMLInputElement>(
        'textbox',
        { name: 'Public name of channel' },
      ),
    ).resolves.toMatchObject({
      value: publicName,
    });
  });
};

export const checkDraftIsCreatedAndHighlighted: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Check draft is created', async () => {
    await expect(
      await canvas.findByTestId('DraftList'),
    ).toBeTruthy();

    await expect(
      await canvas.findByText('Your current state was stored here!'),
    ).toBeTruthy();
  });
};

export const checkPublicTokenIsInvalid: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Check public token is invalid', async () => {
    await waitFor(async () => {
      await expect(
        // not using toHaveBeenLength due the bag of Storybook Interactions
        (await canvas.findByRole('textbox', {
          name: 'Public token',
        })).ariaInvalid,
      ).toBe('true');
    });
  });
};

export const checkStartConditionRunning: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Check running state condition', async () => {
    await expect(
      await canvas.findByRole('button', {
        name: 'Update',
      }),
    ).toBeTruthy();

    // todo KNOWN BUG: ControlPanel always emits fist "invalid"
    // validation report at initialising time.
    // So we had to wait until it gets re-initialised.
    await waitFor(async () => {
      await expect(
        // not using toHaveBeenLength due the bag of Storybook Interactions
        (await canvas.findAllByText('Complete')).length,
      ).toBe(4);
    });
  });
};

export const modifyRunningBotValue: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Modify running bot value', async () => {
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Public name of channel' }),
      ' Copy',
    );

    const switches = await canvas.findAllByRole<HTMLDivElement>('switch');

    switches.forEach((switchElement) => {
      userEvent.click(switchElement);
    });
  });
};

export const updateBot: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Update', async () => {
    await userEvent.click(
      await canvas.findByRole('button', {
        name: 'Update',
      }),
    );

    await expect(
      await canvas.findByText('Request processing...'),
    ).toBeTruthy();

    await waitFor(async () => {
      const stopBotButton = await canvas.findByRole('button', {
        name: 'Stop bot',
      });

      await expect(stopBotButton).toBeEnabled();
    });

    await expect(
      await canvas.findByDisplayValue(/ Copy$/),
    ).toBeTruthy();

    await expect(
      // not using toHaveBeenLength due the bag of Storybook Interactions
      (await canvas.findAllByRole('switch', {
        checked: true,
      })).length,
    ).toBe(3);
  });
};

export const stopBot: PlayFunction<ReactRenderer> = async ({
  canvasElement,
  step,
}) => {
  const canvas = within(canvasElement);

  await step('Stop bot', async () => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Stop bot' }),
    );

    await expect(
      await canvas.findByText('Request processing...'),
    ).toBeTruthy();

    await expect(
      await canvas.findByRole('button', {
        name: 'Start bot',
      }),
    ).toBeTruthy();

    await waitFor(
      async () => expect(
        await canvas.findAllByText('Previous form state saved in draft. You can reuse it later.'),
      ).toBeTruthy(),
    );
  });
};
