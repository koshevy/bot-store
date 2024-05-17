import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/joy/IconButton';
import Snackbar from '@mui/joy/Snackbar';
import Stack, { stackClasses } from '@mui/joy/Stack';
import { styled } from '@mui/joy/styles';
import Typography from '@mui/joy/Typography';
import { useEffect, useMemo, useState } from 'react';

export interface ErrorDetailSnackbarProps {
  messages?: string[];
}

const ErrorDetailSnackbarStyles = styled(Snackbar)`
  max-width: 25rem;

  > .${stackClasses.root} {
    flex-grow: 1;
  }
`;

export function ErrorDetailSnackbar({
  messages,
}: ErrorDetailSnackbarProps) {
  const [
    closedMessages,
    setClosedMessages,
  ] = useState<Record<string, boolean>>();

  useEffect(() => {
    setClosedMessages({});
  }, [
    messages,
  ]);

  return useMemo(() => (
    messages?.map((error) => (
      <ErrorDetailSnackbarStyles
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        color="danger"
        key={error}
        open={!closedMessages?.[error]}
        size="sm"
        variant="outlined"
      >
        <Stack spacing={1}>
          <Typography
            sx={{ color: 'inherit' }}
            level="title-md"
          >
            Bot error
          </Typography>
          <Typography
            sx={{ color: 'inherit' }}
            level="body-sm"
          >
            {error}
          </Typography>
        </Stack>
        <IconButton
          color="danger"
          onClick={() => {
            setClosedMessages((prevState) => ({
              ...prevState,
              [error]: true,
            }));
          }}
          size="sm"
          variant="plain"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </ErrorDetailSnackbarStyles>
    ))
  ), [
    closedMessages,
    messages,
  ]);
}
