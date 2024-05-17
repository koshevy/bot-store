import Stack from '@mui/joy/Stack';
import { styled } from '@mui/joy/styles';
import { Editor } from '@tiptap/react';
import * as classNames from 'classnames';
import {
  Fragment, useEffect, useMemo, useState,
} from 'react';

import {
  ExtensionButton,
  isWrappedAbstractButton,
} from './extension-button-abstract';

export interface MenuBarProps {
  align?: 'justify' | 'compact';
  buttons: ExtensionButton[];
  disabled?: boolean;
  editor: Editor;
}

export const menuBarClasses = {
  compact: 'MenuBar__compact',
  justify: 'MenuBar__justify',
  root: 'MenuBar__root',
} as const;

export const MenuBarStyles = styled(Stack)`
  &.MenuBar__compact {
    align-items: flex-start;
  }
`;

export function MenuBar({
  align = 'compact',
  buttons,
  disabled,
  editor,
}: MenuBarProps) {
  const [revision, setRevision] = useState(0);

  if (!editor) {
    throw new Error('Can\'t access editor!');
  }

  const upRevision = (value: number) => value + 1;

  // tracks update to prevent excessive re-renders
  useEffect(() => {
    const onUpdate = () => setRevision(upRevision);
    editor.on('update', onUpdate);
    editor.on('selectionUpdate', onUpdate);

    return () => {
      editor.off('update', onUpdate);
      editor.off('selectionUpdate', onUpdate);
    };
  }, [
    buttons,
    disabled,
    editor,
  ]);

  return useMemo(() => (
    <MenuBarStyles
      direction="row"
      spacing={0.5}
      className={classNames({
        [menuBarClasses.compact]: align === 'compact',
        [menuBarClasses.justify]: align === 'justify',
        [menuBarClasses.root]: true,
      })}
    >
      {buttons.map((button, index) => {
        if (!isWrappedAbstractButton(button)) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={index}>
              {button.render(editor)}
            </Fragment>
          );
        }

        const {
          getIsActive,
          getIsDisabled,
          onClick,
          surface,
          title,
          wrapper,
        } = button;
        const ButtonWrapper = wrapper;
        const isActive = getIsActive(editor);
        const isDisabled = disabled || getIsDisabled(editor);

        return (
          <ButtonWrapper
            key={title}
            {...{
              isActive,
              isDisabled,
            }}
            onClick={() => {
              onClick(editor);
              setRevision(upRevision);
            }}
            title={title}
          >
            {surface()}
          </ButtonWrapper>
        );
      })}
    </MenuBarStyles>
    // revision is a hack for the force rerender
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [
    align,
    buttons,
    disabled,
    editor,
    revision,
  ]);
}
