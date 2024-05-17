import Stack from '@mui/joy/Stack';
import { styled } from '@mui/joy/styles';
import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Subject } from 'rxjs';

import { ActionPanel, ActionPanelProps } from './action-panel';
import { getDefaultGroups } from './get-default-groups';
import { mapFieldGroupStatus } from './map-field-group-status';
import { DraftList, DraftListProps } from '../draft-list';
import { ErrorDetail } from '../error-detail';
import {
  FieldGroupStatus,
  PreferencesForm,
  PreferencesFormGripAction,
  PreferencesFormProps,
  PreferencesFormValueValidated,
} from '../preferences-form';
import {
  SolidFormStepper,
  SolidFormStepperProps,
} from '../solid-form-stepper';

const defaultGroups = getDefaultGroups();

type ControlPanelValue = NonNullable<PreferencesFormProps['value']>;
type ControlPanelValueValidated = PreferencesFormValueValidated;

export interface ControlPanelProps {
  drafts?: DraftListProps<ControlPanelValue>['value'];
  draftHighlight?: DraftListProps<ControlPanelValue>['highlight'];
  errorDetails?: ErrorDetail[];
  isChangedByDefault?: boolean;
  isRequestProcessing?: boolean;
  onChange?: PreferencesFormProps['onChange'];
  onStartBot?: PreferencesFormProps['onSuccessfullySubmitted'];
  onStopBot?: () => void;
  onSelectDraft?: DraftListProps['onSelect'];
  onUpdateBot?: PreferencesFormProps['onSuccessfullySubmitted'];
  onUpdateDrafts?: DraftListProps['onUpdate'];
  selectedDraft?: string;
  status: ActionPanelProps['status'];
  value?: ControlPanelValue;
  errorMessage?: string;
}

const ControlPanelStyles = styled(Stack)`
  width: 100%;

  .ControlPanel__aside {
    height: 30rem;
    width: 12rem;
    min-width: 12rem;
    position: sticky;
    top: 2rem;
    // important for non-portal tooltips
    // to prevent overlapping by elements at next panel
    z-index: 1001;
  }

  > form {
    flex-grow: 1;
  }
`;

const ActionPanelMemoized = memo(ActionPanel);
const DraftListMemoized = memo(DraftList<ControlPanelValue>);
const PreferencesFormMemoized = memo(PreferencesForm);
const SolidFormStepperMemoized = memo(SolidFormStepper);

export function ControlPanel({
  drafts,
  draftHighlight,
  errorDetails,
  errorMessage,
  isRequestProcessing,
  isChangedByDefault,
  onChange,
  onSelectDraft,
  onStartBot,
  onStopBot,
  onUpdateBot,
  onUpdateDrafts,
  selectedDraft,
  status = 'loading',
  value,
}: ControlPanelProps) {
  const [
    actualValue,
    setActualValue,
  ] = useState<ControlPanelValue | undefined>(value);

  const [
    isChanged,
    setIsChanged,
  ] = useState(isChangedByDefault);

  const [
    actualSteps,
    setActualSteps,
  ] = useState<SolidFormStepperProps['steps']>(defaultGroups);

  const [
    isPreliminaryInitialised,
    setIsPreliminaryInitialised,
  ] = useState(false);

  const [
    hideHighlights,
    setHideHighlights,
  ] = useState(false);

  const [
    actualSelectedDraft,
    setActualSelectedDraft,
  ] = useState<string | undefined>(selectedDraft);

  const handleValidationStatus = useCallback((groups: FieldGroupStatus[]) => {
    const newGroups = groups.map(mapFieldGroupStatus);

    // when it is not at first step
    if (isPreliminaryInitialised) {
      setActualSteps(newGroups);
      // highlight errors (hack related with react-hook-form)
      // todo make more simple and readable
      // todo HIGH RISK OF INFINITE CYCLES!
      //      If there no one field/value will be associated with concrete field
      //      after validation triggered by submit
      // if (newGroups.some(({ status }) => status === 'invalid')) {
      // formGrip.next({ type: 'submit' })
      // }

      return;
    }

    setIsPreliminaryInitialised(true);
    // at first time this makes animation smooth
    setTimeout(() => {
      setActualSteps((oldGroups) => (oldGroups === defaultGroups ? newGroups : oldGroups));
    }, 400);
  }, [
    isPreliminaryInitialised,
    setActualSteps,
    setIsPreliminaryInitialised,
  ]);

  const handleDraftSelect = useCallback<
  NonNullable<DraftListProps<ControlPanelValue>['onSelect']>
  >(({ dateTime, payload, uuid }) => {
    setActualValue({ ...payload });
    setHideHighlights(true);
    setActualSelectedDraft(uuid);
    setIsChanged(true);
    onSelectDraft?.({ dateTime, payload, uuid });
  }, [
    onSelectDraft,
    setActualValue,
    setHideHighlights,
    setActualSelectedDraft,
  ]);

  const isInputDisabled = !isPreliminaryInitialised
    || isRequestProcessing
    || (status === 'loading')
    || (status === 'check-failed');

  const formGrip = useMemo(() => new Subject<
  PreferencesFormGripAction
  >(), []);

  useLayoutEffect(() => {
    if (isPreliminaryInitialised) {
      setIsChanged(false);
      setActualValue(value);
    }
  }, [
    isPreliminaryInitialised,
    value,
  ]);

  useLayoutEffect(() => {
    setActualSelectedDraft(selectedDraft);
  }, [
    selectedDraft,
  ]);

  useEffect(
    () => (() => formGrip.complete()),
    [formGrip],
  );

  useEffect(() => {
    errorDetails?.forEach((payload) => {
      formGrip.next({
        type: 'registerWrongValue',
        payload,
      });
    });

    if (errorDetails?.length) {
      setTimeout(
        () => formGrip.next({ type: 'submit' }),
        500,
      );
    }
  }, [
    errorDetails,
    formGrip,
  ]);

  useEffect(() => {
    if (draftHighlight) {
      setHideHighlights(false);
    }
  }, [
    draftHighlight,
  ]);

  const handleStartOrUpdateBot = useCallback(() => {
    formGrip.next({ type: 'submit' });
  }, [
    formGrip,
  ]);

  const handleSubmit = useCallback((data: ControlPanelValueValidated) => {
    if (status === 'stopped') {
      onStartBot?.(data);
    }

    if (status === 'running') {
      onUpdateBot?.(data);
    }
  }, [
    status,
    onStartBot,
    onUpdateBot,
  ]);

  const handleStop = useCallback<
  NonNullable<ActionPanelProps['onStopBot']>
  >(() => {
    // Emits onChange to have opportunity to save draft after stop
    if (actualValue) {
      onChange?.(actualValue);
    }

    onStopBot?.();
  }, [
    actualValue,
    onChange,
    onStopBot,
  ]);

  const handleHideDraftHighlight = useCallback(() => {
    setHideHighlights(true);
  }, []);

  const handleChange = useCallback<
  NonNullable<PreferencesFormProps['onChange']>
  >((newValue) => {
    setIsChanged(JSON.stringify(newValue) !== JSON.stringify(actualValue));
    onChange?.(newValue);
  }, [
    actualValue,
    onChange,
  ]);

  const handleRevert = useCallback(() => {
    formGrip.next({ type: 'reset' });

    setActualValue(value);
    setIsChanged(false);
    setActualSelectedDraft(undefined);
  }, [
    formGrip,
    setActualValue,
    setActualSelectedDraft,
    setIsChanged,
    value,
  ]);

  return (
    <ControlPanelStyles direction="row" spacing={6}>
      <Stack className="ControlPanel__aside" spacing={4}>
        <SolidFormStepperMemoized
          steps={status === 'loading' ? defaultGroups : actualSteps}
        />
        <ActionPanelMemoized
          arePreferencesChanged={isChanged}
          errorDetails={errorDetails}
          isRequestProcessing={isRequestProcessing}
          onRevert={handleRevert}
          onStartBot={handleStartOrUpdateBot}
          onStopBot={handleStop}
          onUpdate={handleStartOrUpdateBot}
          status={status}
          errorMessage={errorMessage}
        />
        <DraftListMemoized
          disabled={isInputDisabled}
          highlight={!hideHighlights ? draftHighlight : undefined}
          onRemoveHighlight={handleHideDraftHighlight}
          onSelect={handleDraftSelect}
          onUpdate={onUpdateDrafts}
          selected={actualSelectedDraft}
          value={drafts}
        />
      </Stack>
      <PreferencesFormMemoized
        disabled={isInputDisabled}
        formGrip={formGrip}
        isLoading={status === 'loading'}
        onChange={handleChange}
        onSuccessfullySubmitted={handleSubmit}
        onValidationStatusChange={handleValidationStatus}
        value={actualValue}
      />
    </ControlPanelStyles>
  );
}
