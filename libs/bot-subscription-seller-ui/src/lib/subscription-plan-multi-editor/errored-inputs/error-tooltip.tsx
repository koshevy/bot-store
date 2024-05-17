import Tooltip, { TooltipProps } from '@mui/joy/Tooltip';
import { PropsWithChildren } from 'react';

export const ErrorTooltip = ({ children, ...props }: PropsWithChildren<TooltipProps>) => (
  <Tooltip
    placement="bottom-start"
    color="danger"
    variant="soft"
    {...props}
  >
    {children}
  </Tooltip>
);
