import IconButton from '@mui/joy/IconButton';
import { styled } from '@mui/joy/styles';
import Tooltip from '@mui/joy/Tooltip';
import { forwardRef, PropsWithChildren } from 'react';

import { ButtonWrapperProps } from './extension-button';

const IconButtonStyled = styled(IconButton)`
  width: 1.6rem;
  min-width: auto;
  min-height: auto;

  svg {
    width: 1.1rem;
  }
`;

export const DefaultExtensionButtonWrapper = forwardRef<
HTMLButtonElement,
PropsWithChildren<ButtonWrapperProps>
>(({
  children,
  isActive,
  isDisabled,
  onClick,
  title,
}, ref) => (
  <Tooltip title={title} size="sm">
    <IconButtonStyled
      tabIndex={-1}
      ref={ref}
      color="neutral"
      disabled={isDisabled}
      onClick={onClick}
      size="sm"
      variant={isActive ? 'solid' : 'soft'}
    >
      {children}
    </IconButtonStyled>
  </Tooltip>
));
