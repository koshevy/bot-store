import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Box from '@mui/joy/Box';
import { styled, Theme } from '@mui/joy/styles';
import * as classNames from 'classnames';

export interface DragHandlerProps {
  dragHandlerParams?: Record<
  string,
  | string
  | number
  | boolean
  | ((...args: unknown[]) => void)
  | undefined
  >
}

export const DragHandlerStyles = styled(Box)(({ theme }: { theme: Theme }) => `
  &.DragHandler__dragHandler {
    cursor: grab;

    &[aria-pressed] {
      cursor: grabbing;
    }

    &_Disabled {
      cursor: default;
      color: ${theme.palette.neutral.solidBg};
      opacity: .3;
    }
  }
`);

export function DragHandler({
  dragHandlerParams,
}: DragHandlerProps) {
  return (
    <DragHandlerStyles
      className={classNames({
        DragHandler__dragHandler: !!dragHandlerParams,
        DragHandler__dragHandler_Disabled: !dragHandlerParams,
      })}
      {...dragHandlerParams}
    >
      <DragIndicatorIcon />
    </DragHandlerStyles>
  );
}
