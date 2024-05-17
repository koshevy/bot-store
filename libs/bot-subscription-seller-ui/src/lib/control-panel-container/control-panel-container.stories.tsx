import { faker } from '@faker-js/faker';
import { Title, Subtitle, Description } from '@storybook/blocks';
import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

import { ControlPanelTransportMock } from './__mocks__';
import * as TestSteps from './__tests__/control-panel-container.steps';
import {
  ControlPanelContainer,
  ControlPanelContainerProps,
} from './control-panel-container';
import {
  ControlPanelTransportContext,
} from './control-panel-transport';

faker.seed(0);

type ThisStoryArgs = ControlPanelContainerProps & {
  transportArgs: Readonly<ConstructorParameters<typeof ControlPanelTransportMock>>;
} ;

const Story: Meta<ThisStoryArgs> = {
  component: ControlPanelContainer,
  title: 'Bot Subscription Seller/Control Panel Container',
  decorators: [
    (OriginalStory, {
      args: {
        refetchInterval,
        transportArgs,
      },
    }) => {
      // recreate transport every time when story is selected again
      // to avoid persistent state
      const transport = useMemo(() => (
        new ControlPanelTransportMock(...transportArgs)
      ), [
        transportArgs,
      ]);
      // recreate client every time when story is selected again
      // to avoid persistent state
      const queryClient = useMemo(() => new QueryClient(), []);

      return (
        <QueryClientProvider client={queryClient}>
          <ControlPanelTransportContext.Provider
            value={transport}
          >
            <OriginalStory args={{ refetchInterval }} />
          </ControlPanelTransportContext.Provider>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
        </>
      ),
    },
  },
  tags: [
    'autodocs',
  ],
};

export default Story;

const SuccessfulStartAndUpdateArgs = () => ({
  refetchInterval: 1000,
  transportArgs: [
    'success',
    'stopped',
    1000,
  ] as const,
});
export const SuccessfulStartAndUpdatePlayground: StoryObj<ThisStoryArgs> = {
  args: SuccessfulStartAndUpdateArgs(),
};
SuccessfulStartAndUpdatePlayground.storyName = '🕹️ Playground / Successful start, update and revert';
export const SuccessfulStartAndUpdate: StoryObj<ThisStoryArgs> = {
  args: SuccessfulStartAndUpdateArgs(),
};
SuccessfulStartAndUpdate.storyName = '▶️ Scenario / Successful start, update and revert';
SuccessfulStartAndUpdate.play = async (playParams) => {
  await TestSteps.checkStartConditionStopped(playParams);
  await TestSteps.fillMissedValuesStopped(playParams);
  await TestSteps.checkValidationStatusIsComplete(playParams);
  await TestSteps.startBot(playParams);
  await TestSteps.checkUpdateButtonDisabling(playParams);
  await TestSteps.updateValueAfterStart(playParams);
  await TestSteps.revertChangedValue(playParams);
};

const FailedStartWithErrorsFromBackendArgs = () => ({
  transportArgs: [
    'fail',
    'stopped',
  ] as const,
});
export const FailedStartWithErrorsFromBackendPlayground: StoryObj<ThisStoryArgs> = {
  args: FailedStartWithErrorsFromBackendArgs(),
};
FailedStartWithErrorsFromBackendPlayground.storyName = '🕹️ Playground / Failed start with errors from backend';
export const FailedStartWithErrorsFromBackend: StoryObj<ThisStoryArgs> = {
  args: FailedStartWithErrorsFromBackendArgs(),
};
FailedStartWithErrorsFromBackend.storyName = '▶️ Scenario / Failed start with errors from backend';
FailedStartWithErrorsFromBackend.play = async (playParams) => {
  await TestSteps.checkStartConditionStopped(playParams);
  await TestSteps.fillMissedValuesStopped(playParams);
  await TestSteps.checkValidationStatusIsComplete(playParams);
  await TestSteps.startBot(playParams);
  await TestSteps.checkDraftIsCreatedAndHighlighted(playParams);
  await TestSteps.checkPublicTokenIsInvalid(playParams);
};

const SuccessfulUpdateFastArgs = () => ({
  refetchInterval: 200,
  transportArgs: [
    'success',
    'running',
    200,
  ] as const,
});
export const SuccessfulUpdateFastPlayground: StoryObj<ThisStoryArgs> = {
  args: SuccessfulUpdateFastArgs(),
};
SuccessfulUpdateFastPlayground.storyName = '🕹️ Playground / Successful update with fast delay';
export const SuccessfulUpdateFast: StoryObj<ThisStoryArgs> = {
  args: SuccessfulUpdateFastArgs(),
};
SuccessfulUpdateFast.storyName = '▶️ Scenario / Successful update and stop with fast delay';
SuccessfulUpdateFast.play = async (playParams) => {
  await TestSteps.checkStartConditionRunning(playParams);
  await TestSteps.modifyRunningBotValue(playParams);
  await TestSteps.updateBot(playParams);
  await TestSteps.stopBot(playParams);
};

export const SuccessfulUpdateSlow: StoryObj<ThisStoryArgs> = {
  args: {
    transportArgs: [
      'success',
      'running',
      2000,
    ],
  },
};
SuccessfulUpdateSlow.storyName = '🕹️ Playground / Successful update with slow delay';

export const FailedUpdateWithErrorsFromBackend: StoryObj<ThisStoryArgs> = {
  args: {
    transportArgs: [
      'fail',
      'running',
      800,
    ],
  },
};
FailedUpdateWithErrorsFromBackend.storyName = '🕹️ Playground / Failed update with errors from backend';
