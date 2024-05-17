import {
  memo,
  useLayoutEffect,
  useMemo,
} from 'react';

import { useDraftHighlights } from './use-draft-highlights';
import { useDrafts } from './use-drafts';
import { useStartBot } from './use-start-bot';
import { useStatus, UseStatusProps } from './use-status';
import { useStopBot } from './use-stop-bot';
import { useUpdateBot } from './use-update-bot';
import {
  ControlPanel,
  ControlPanelProps,
  PreferencesFormValue,
} from '../control-panel';

export {
  PreferencesFormValue,
  PreferencesFormValueValidated,
  PreferencesFormValueValidator,
} from '../control-panel';

export type ControlPanelContainerProps = UseStatusProps;
export const ControlPanelMemoized = memo(ControlPanel);

/**
 * Wrapper for `ControlPanel` with backend client.
 * Parses and maps state fetched from backend to the UI state.
 *
 * > **This is the main UI component of Subscription Seller Bot**
 *
 * #### Example
 *
 * ```tsx
 * <QueryClientProvider client={queryClient}>
 *   <ControlPanelTransportContext.Provider value={transport}>
 *     <ControlPanelContainer />
 *   </ControlPanelTransportContext.Provider>
 * </QueryClientProvider>
 * ```
 */
export function ControlPanelContainer({
  refetchInterval = 3000,
}: ControlPanelContainerProps) {
  const {
    data,
    isLoading,
  } = useStatus({
    refetchInterval,
  });

  const {
    allDrafts,
    draftInWorkId,
    handleOnChangeDraft,
    handleOnUpdateAllDrafts,
    selectedDraft,
    selectedDraftId,
    setSelectedDraftId,
  } = useDrafts();

  const {
    isPending: isStartBotPending,
    isError: isStartBotError,
    mutate: handleStartBot,
    data: startBotData,
    reset: resetStartBotMutation,
  } = useStartBot();

  const {
    isPending: isStopBotPending,
    isError: isStopBotError,
    mutate: handleStopBot,
    data: stopBotData,
    reset: resetStopBotMutation,
  } = useStopBot();

  const {
    isPending: isUpdateBotPending,
    isError: isUpdateBotError,
    mutate: handleUpdateBot,
    data: updateBotData,
    reset: resetUpdateBotMutation,
  } = useUpdateBot();

  // should wait for next status update after previous update
  const isJustSuccessfullyRequestedNewState = startBotData?.success || !!stopBotData?.success;
  const isJustStopped = data?.status === 'stopped' && !!stopBotData?.success;
  const hasProblemsWithStart = isStartBotError || startBotData?.success === false;
  const hasProblemsWithStop = isStopBotError || stopBotData?.success === false;
  const hasProblemsWithUpdate = isUpdateBotError || updateBotData?.success === false;

  const {
    draftHighlight,
  } = useDraftHighlights({
    draftInWorkId,
    hasProblemsWithStart,
    hasProblemsWithStop,
    hasProblemsWithUpdate,
    isJustStopped,
    selectedDraftId,
    setSelectedDraftId,
    status: data?.status,
  });

  // clears/highlights results of mutations
  // every time when status gets changed
  useLayoutEffect(() => {
    resetStartBotMutation();
    resetStopBotMutation();
    resetUpdateBotMutation();
  }, [
    resetStartBotMutation,
    resetStopBotMutation,
    resetUpdateBotMutation,
    data?.status,
  ]);

  // common props set for ControlPanel
  // to be mixed with specialised props diff
  const formStateProps = useMemo((): ControlPanelProps => {
    if (isLoading || !data) {
      return {
        status: 'loading',
      };
    }

    // *** STATUS: Stopped
    if (data.status === 'stopped') {
      const unknownErrorProps = isStartBotError
        ? { errorMessage: 'Launch of bot failed due the unknown error. Please, try later.' }
        : {};
      const failedStartProps = startBotData?.success === false
        ? {
          errorDetails: startBotData?.success === false
            ? startBotData.errorDetails
            : undefined,
          errorMessage: 'Launch of bot failed',
        }
        : {};

      const value = selectedDraft?.payload ?? data.payload;

      return {
        isRequestProcessing: isStartBotPending || isJustSuccessfullyRequestedNewState,
        status: 'stopped',
        onStartBot: handleStartBot,
        value,
        ...unknownErrorProps,
        ...failedStartProps,
      };
    }

    // *** STATUS: Running
    if (data.status === 'running') {
      const unknownErrorProps = isUpdateBotError
        ? { errorMessage: 'Update of bot failed due the unknown error. Please, try later.' }
        : {};
      const failedStartProps = updateBotData?.success === false
        ? {
          errorDetails: updateBotData?.success === false
            ? updateBotData.errorDetails
            : undefined,
          errorMessage: 'Update of bot preferences failed',
        }
        : {};

      const formValue = (updateBotData?.success === true && updateBotData.payload)
        ? updateBotData.payload
        : data.payload;

      const isRequestProcessing = isStopBotPending
        || isUpdateBotPending
        || isJustSuccessfullyRequestedNewState;

      return {
        isRequestProcessing,
        status: 'running',
        onUpdateBot: handleUpdateBot,
        value: formValue as PreferencesFormValue,
        ...unknownErrorProps,
        ...failedStartProps,
      };
    }

    return {
      status: 'error',
    };
  }, [
    data,
    handleStartBot,
    handleUpdateBot,
    isJustSuccessfullyRequestedNewState,
    isLoading,
    isStartBotError,
    isStartBotPending,
    isStopBotPending,
    isUpdateBotError,
    isUpdateBotPending,
    selectedDraft,
    startBotData,
    updateBotData,
  ]);

  return (
    <ControlPanelMemoized
      {...formStateProps}
      drafts={allDrafts}
      draftHighlight={draftHighlight}
      selectedDraft={selectedDraftId}
      onChange={handleOnChangeDraft}
      onStopBot={handleStopBot}
      onUpdateDrafts={handleOnUpdateAllDrafts}
    />
  );
}
