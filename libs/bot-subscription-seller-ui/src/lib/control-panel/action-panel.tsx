import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import ErrorIcon from '@mui/icons-material/Error';
import PanToolIcon from '@mui/icons-material/PanTool';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import RuleIcon from '@mui/icons-material/Rule';
import UndoIcon from '@mui/icons-material/Undo';
import Alert from '@mui/joy/Alert';
import Button from '@mui/joy/Button';
import ButtonGroup from '@mui/joy/ButtonGroup';
import CircularProgress from '@mui/joy/CircularProgress';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import { styled } from '@mui/joy/styles';
import Tooltip from '@mui/joy/Tooltip';
import { useState } from 'react';

import { useActionMenu } from './action-menu';
import { ErrorDetailPopup } from './error-details-popup';
import { ErrorDetail } from '../error-detail';

export type ActionPanelStatus = | 'loading'
| 'running'
| 'stopped'
| 'check-failed'
| 'error';

export interface ActionPanelProps {
  arePreferencesChanged?: boolean;
  errorMessage?: string;
  errorDetails?: ErrorDetail[];
  isRequestProcessing?: boolean;
  onRevert?: () => void;
  onStartBot?: () => void;
  onStatusCheck?: () => void;
  onStopBot?: () => void;
  onUpdate?: () => void;
  status: ActionPanelStatus;
}

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => `
  justify-content: stretch;

  > :first-of-type {
    flex-grow: 1;
  }

  > :last-of-type {
    border-left: .1rem solid ${theme.palette.background.surface};
  }
`);

const StyledAlert = styled(Alert)`
  justify-content: center;

  button {
    --Button-minHeight: 1.2rem;
    font-size: .75rem;
    padding: 0 .4rem;
  }
`;

/**
 * todo Refactoring is needed. Necessary to decompose this component.
 */
export function ActionPanel({
  arePreferencesChanged,
  errorDetails,
  errorMessage,
  isRequestProcessing,
  onRevert,
  onStartBot,
  onStatusCheck,
  onStopBot,
  onUpdate,
  status,
}: ActionPanelProps) {
  const {
    isOpen: isUpdateButtonOpen,
    menu: updateActionsMenu,
    setElement: setUpdateButton,
    setIsOpen: setIsUpdateButtonOpen,
  } = useActionMenu({
    actions: [
      {
        title: 'Update bot preferences',
        icon: <CloudSyncIcon fontSize="small" />,
        onClick: onUpdate,
      },
      {
        title: 'Revert changes',
        icon: <UndoIcon fontSize="small" />,
        onClick: onRevert,
      },
    ],
  });

  const [isErrorsPopupShown, setIsErrorsPopupShown] = useState(false);

  const isUpdateButtonDisabled = !arePreferencesChanged
    || isRequestProcessing
    || status === 'loading';

  const updateButton = (
    <StyledButtonGroup
      variant="soft"
      disabled={isUpdateButtonDisabled}
      ref={(element) => setUpdateButton(element)}
    >
      <Button
        variant="solid"
        color="primary"
        onClick={onUpdate}
        startDecorator={<CloudSyncIcon />}
      >
        Update
      </Button>
      {updateActionsMenu}

      <IconButton
        color="primary"
        variant="solid"
        onClick={() => setIsUpdateButtonOpen(!isUpdateButtonOpen)}
      >
        <ArrowDropDownIcon />
      </IconButton>
    </StyledButtonGroup>
  );

  const isRequestProcessingIndicator = isRequestProcessing ? (
    <StyledAlert
      variant="plain"
      startDecorator={<CircularProgress size="sm" />}
      size="sm"
    >
      Request processing...
    </StyledAlert>
  ) : null;

  const errorDetailsButton = errorDetails?.length
    ? (
      <Tooltip
        disablePortal
        title={isErrorsPopupShown ? '' : 'Show error details'}
      >
        <Button
          color="danger"
          onClick={() => setIsErrorsPopupShown(!isErrorsPopupShown)}
          size="sm"
          variant={isErrorsPopupShown ? 'solid' : 'soft'}
        >
          ?
        </Button>
      </Tooltip>
    )
    : null;

  const errorMessageAlert = errorMessage
    ? (
      <ErrorDetailPopup
        disablePortal
        errorDetails={errorDetails}
        onClose={() => setIsErrorsPopupShown(false)}
        open={isErrorsPopupShown}
      >
        <StyledAlert
          color="danger"
          variant="plain"
          size="sm"
          startDecorator={
            errorDetails?.length ? undefined : <ErrorIcon fontSize="small" />
          }
        >
          <Stack spacing={1}>
            {errorMessage}
          </Stack>
          {errorDetailsButton}
        </StyledAlert>
      </ErrorDetailPopup>
    )
    : null;

  if (status === 'loading') {
    return (
      <Stack spacing={1}>
        <Button
          disabled
          color="neutral"
          onClick={onStopBot}
          variant="solid"
          startDecorator={<CircularProgress size="sm" />}
        >
          Checking status...
        </Button>
      </Stack>
    );
  }

  if (status === 'running' || status === 'check-failed') {
    const isCheckFailed = status === 'check-failed';

    return (
      <Stack spacing={1}>
        {updateButton}
        <Button
          disabled={isRequestProcessing}
          color="danger"
          onClick={onStopBot}
          variant="solid"
          startDecorator={<PanToolIcon />}
        >
          Stop bot
        </Button>
        <Button
          disabled={isRequestProcessing || isCheckFailed}
          color="neutral"
          onClick={onStatusCheck}
          variant="solid"
          startDecorator={<RuleIcon />}
        >
          Check
        </Button>
        {isRequestProcessingIndicator}
        {errorMessageAlert}
      </Stack>
    );
  }

  if (status === 'stopped') {
    return (
      <Stack spacing={1}>
        <Button
          disabled={isRequestProcessing}
          color="success"
          onClick={onStartBot}
          variant="solid"
          startDecorator={<RocketLaunchIcon />}
        >
          Start bot
        </Button>
        {isRequestProcessingIndicator}
        {errorMessageAlert}
      </Stack>
    );
  }

  return (
    <StyledAlert color="danger" variant="plain" size="sm">
      Unknown state
    </StyledAlert>
  );
}
