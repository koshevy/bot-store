import { nanoid } from 'nanoid';
import {
  useCallback, useLayoutEffect, useState, useEffect, useMemo,
} from 'react';

import { useTransport } from './control-panel-transport';
import {
  ControlPanelProps,
  PreferencesFormValue,
} from '../control-panel';

interface UseDraftsProps {
  draftId?: string;
}

export function useDrafts({
  draftId,
}: UseDraftsProps = {}) {
  const transport = useTransport();
  const [
    allUpdatesCount,
    setAllUpdatesCount,
  ] = useState(0);
  const [draftInWorkId, setDraftInWorkId] = useState<string>(draftId ?? nanoid());
  const [selectedDraftId, setSelectedDraftId] = useState<string>();

  useLayoutEffect(() => {
    if (draftId && draftId !== draftInWorkId) {
      setDraftInWorkId(draftId ?? nanoid());
    }
  }, [
    draftId,
    draftInWorkId,
    setDraftInWorkId,
  ]);

  const handleOnChangeDraft = useCallback<NonNullable<ControlPanelProps['onChange']>>(
    (payload) => {
      if (!draftInWorkId) {
        return;
      }

      transport.saveDraft({
        uuid: draftInWorkId,
        dateTime: (new Date()).toISOString(),
        // todo fix control panel value types
        payload: payload as PreferencesFormValue,
      });
    },
    [
      draftInWorkId,
      transport,
    ],
  );

  const handleOnUpdateAllDrafts = useCallback<NonNullable<ControlPanelProps['onUpdateDrafts']>>(
    (drafts) => {
      if (!drafts.some(({ uuid }) => uuid === selectedDraftId)) {
        setSelectedDraftId(undefined);
      }

      transport.setDrafts(drafts);
      setAllUpdatesCount((count) => count + 1);
    },
    [
      transport,
      selectedDraftId,
      setSelectedDraftId,
      setAllUpdatesCount,
    ],
  );

  const getAllDrafts = () => (
    transport.getAllDrafts().filter(({ uuid }) => (
      // skips current draft in work if it's not selected
      uuid !== draftInWorkId || uuid === selectedDraftId
    ))
  );

  const [allDrafts, setAllDrafts] = useState(() => getAllDrafts());

  const selectedDraft = useMemo(() => (
    selectedDraftId
      ? transport.getDraft(selectedDraftId)
      : undefined
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  ), [
    selectedDraftId,
    transport,
    // important
    allUpdatesCount,
  ]);

  useEffect(() => {
    setAllDrafts(getAllDrafts());
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [
    draftInWorkId,
    selectedDraftId,
    transport,
    allUpdatesCount,
  ]);

  return {
    allDrafts,
    draftInWorkId,
    handleOnChangeDraft,
    handleOnUpdateAllDrafts,
    selectedDraft,
    selectedDraftId,
    setDraftInWorkId,
    setSelectedDraftId,
  };
}
