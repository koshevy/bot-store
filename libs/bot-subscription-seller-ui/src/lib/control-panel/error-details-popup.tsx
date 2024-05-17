import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/joy/Box';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Stack, { stackClasses } from '@mui/joy/Stack';
import { styled } from '@mui/joy/styles';
import Tooltip, { TooltipProps } from '@mui/joy/Tooltip';
import Typography from '@mui/joy/Typography';

import { ErrorDetail } from '../error-detail';

export interface ErrorDetailPopupProps {
  errorDetails?: ErrorDetail[];
  maxMessages?: number;
  onClose?: () => void;
}

type CustomizedTooltipProps = Omit<
TooltipProps,
'arrow' | 'color' | 'title' | 'variant' | 'onClose'
>;

const ErrorDetailPopupStyles = styled(Stack)`
  align-items: center;
  padding: .4rem;
  min-width: 17rem;
  max-width: 25rem;

  .${iconButtonClasses.root} {
    svg {
      font-size: 1rem;
    }
  }

  .${stackClasses.root} {
    flex-grow: 1;
  }
`;

export function ErrorDetailPopup({
  errorDetails,
  children,
  maxMessages = 10,
  onClose,
  open,
  placement = 'right',
  ...props
}: CustomizedTooltipProps & ErrorDetailPopupProps) {
  if (!errorDetails?.length) {
    return children;
  }

  const actualProps = {
    arrow: true,
    placement,
    variant: 'outlined',
    ...props,
  } as const;

  const title = (
    <ErrorDetailPopupStyles
      direction="row"
      spacing={0.5}
      onClick={(event) => event.stopPropagation()}
    >
      <Stack spacing={1.5}>
        {errorDetails.slice(0, maxMessages).map(({ path, message }) => (
          <Box key={`${path}-${message}`}>
            <Typography level="title-sm">
              {path}
            </Typography>
            <Typography color="danger" level="body-sm">
              {message}
            </Typography>
          </Box>
        ))}
      </Stack>
      <IconButton onClick={onClose} size="sm">
        <CloseIcon />
      </IconButton>
    </ErrorDetailPopupStyles>
  );

  return (
    <Tooltip
      {...actualProps}
      open={open}
      title={title}
      placement={placement}
      color="danger"
    >
      {children}
    </Tooltip>
  );
}
