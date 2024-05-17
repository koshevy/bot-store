import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import {
  forwardRef,
  ReactElement,
  ReactNode,
  useState,
} from 'react';

export interface Action {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface ActionMenuProps {
  actions: Action[];
  anchorEl: Element;
  isOpen?: boolean;
  onClickAway?: () => void;
}

export const ActionMenu = forwardRef<
HTMLDivElement,
ActionMenuProps
>(({
  actions,
  anchorEl,
  isOpen,
  onClickAway,
}, ref) => {
  const handleClick = ({ target }: MouseEvent | TouchEvent) => {
    if (!target || !(target instanceof Node)) {
      return;
    }

    if (target === anchorEl || anchorEl.contains(target)) {
      return;
    }

    onClickAway?.();
  };

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={handleClick}
    >
      <Menu
        disablePortal
        size="sm"
        anchorEl={anchorEl}
        open={isOpen}
        placement="bottom-start"
        ref={ref}
        sx={{ zIndex: '1001' }}
      >
        {actions.map(({ title, icon, onClick }) => (
          <MenuItem
            key={title}
            onClick={() => {
              onClick?.();
              onClickAway?.();
            }}
          >
            {icon}
            {title}
          </MenuItem>
        ))}
      </Menu>
    </ClickAwayListener>
  );
});

export interface UseActionMenuProps {
  actions: Action[];
  isInitiallyOpen?: boolean;
}

export interface UseActionMenuResult {
  isOpen: boolean;
  menu: ReactElement<typeof ActionMenu> | null;
  setIsOpen: (isOpen: boolean) => void;
  setElement: (anchorElement: Element | null) => void;
}

export function useActionMenu({
  actions,
  isInitiallyOpen = false,
}: UseActionMenuProps): UseActionMenuResult {
  const [isOpen, setIsOpen] = useState<boolean>(isInitiallyOpen);
  const [element, setElement] = useState<Element | null>(null);

  const menu = element
    ? (
      <ActionMenu
        anchorEl={element}
        actions={actions}
        isOpen={isOpen}
        onClickAway={() => {
          if (isOpen) {
            setIsOpen(false);
          }
        }}
      />
    )
    : null;

  return {
    isOpen,
    menu,
    setIsOpen,
    setElement,
  };
}
