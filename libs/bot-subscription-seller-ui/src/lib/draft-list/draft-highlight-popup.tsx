import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/joy/Box';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import { styled } from '@mui/joy/styles';
import Tooltip, { TooltipProps } from '@mui/joy/Tooltip';
import { ReactNode } from 'react';

export interface DraftHighlightPopupProps {
  draftUuid?: string;
  color?: 'neutral' | 'primary' | 'warning' | 'danger';
  onClose?: () => void;
  text?: string | ReactNode;
}

type CustomizedTooltipProps = Omit<
TooltipProps,
'arrow' | 'color' | 'title' | 'variant'
>;

const DraftHighlightPopupStyles = styled(Stack)`
  align-items: center;
  padding: .4rem;
  min-width: 17rem;
  max-width: 25rem;

  .${iconButtonClasses.root} {
    svg {
      font-size: 1rem;
    }
  }
`;

export function DraftHighlightPopup({
  color,
  draftUuid,
  children,
  onClose,
  open,
  placement = 'bottom-start',
  text,
  ...props
}: CustomizedTooltipProps & DraftHighlightPopupProps) {
  if (!open || !draftUuid || !text) {
    return children;
  }

  const actualProps = {
    arrow: true,
    color,
    placement,
    variant: 'outlined',
    ...props,
  } as const;

  const title = (
    <DraftHighlightPopupStyles
      direction="row"
      spacing={0.5}
      onClick={(event) => event.stopPropagation()}
    >
      <Box>{text}</Box>
      <IconButton onClick={onClose} size="sm">
        <CloseIcon />
      </IconButton>
    </DraftHighlightPopupStyles>
  );

  return (
    <Tooltip
      {...actualProps}
      open={open}
      title={title}
      placement={placement}
    >
      {children}
    </Tooltip>
  );
}
