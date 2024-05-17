import { useLayoutEffect, useState } from 'react';

import {
  ActionPanelStatus,
  DraftHighlightPopupProps,
} from '../control-panel';

export {
  PreferencesFormValue,
  PreferencesFormValueValidated,
  PreferencesFormValueValidator,
} from '../control-panel';

export interface UseDraftHighlights {
  draftInWorkId: string;
  hasProblemsWithStart: boolean;
  hasProblemsWithStop: boolean;
  hasProblemsWithUpdate: boolean;
  isJustStopped: boolean;
  selectedDraftId?: string;
  setSelectedDraftId: (uuid?: string) => void;
  status?: ActionPanelStatus;
}

export function useDraftHighlights({
  draftInWorkId,
  hasProblemsWithStart,
  hasProblemsWithStop,
  hasProblemsWithUpdate,
  isJustStopped,
  selectedDraftId,
  setSelectedDraftId,
  status,
}: UseDraftHighlights) {
  const [
    draftHighlight,
    setDraftHighlight,
  ] = useState<DraftHighlightPopupProps>();

  // reset highlights after start/update
  useLayoutEffect(() => {
    if (status !== 'running') {
      return;
    }

    setDraftHighlight(undefined);
    setSelectedDraftId(undefined);
  }, [
    setSelectedDraftId,
    status,
  ]);

  // set highlight when data is getting lost
  useLayoutEffect(() => {
    if (
      !hasProblemsWithStart
      && !hasProblemsWithUpdate
      && !hasProblemsWithStop
      && !isJustStopped
    ) {
      return;
    }

    if (draftHighlight) {
      return;
    }

    if (selectedDraftId !== draftInWorkId) {
      setSelectedDraftId(draftInWorkId);
    }

    if (isJustStopped) {
      setDraftHighlight({
        color: 'primary',
        draftUuid: draftInWorkId,
        text: 'Previous form state saved in draft. You can reuse it later.',
      });

      return;
    }

    // shows/highlight drafts every time at error
    if (hasProblemsWithStart || hasProblemsWithUpdate || hasProblemsWithStop) {
      setDraftHighlight({
        color: 'warning',
        draftUuid: draftInWorkId,
        text: (
          <>
            <strong>Your current state was stored here!</strong>
            <br />
            Since your changes were not applied,
            I saved your current form state in the draft.
          </>
        ),
      });
    }
  }, [
    draftHighlight,
    draftInWorkId,
    isJustStopped,
    hasProblemsWithStart,
    hasProblemsWithUpdate,
    hasProblemsWithStop,
    selectedDraftId,
    setSelectedDraftId,
  ]);

  return {
    draftHighlight,
  };
}
