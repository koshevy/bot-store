import { CharacterCount } from '@tiptap/extension-character-count';
import {
  EditorContent,
  EditorProviderProps,
  Extension,
  useEditor,
} from '@tiptap/react';
import * as classNames from 'classnames';
import { compact } from 'lodash-es';
import {
  forwardRef,
  HTMLAttributes,
  MouseEvent,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { ExtensionButton } from './extension-button-abstract';
import { MenuBar } from './menu-bar';
import {
  defaultButtons,
  defaultRootExtensions,
} from './message-editor.config';
import { MessageEditorStyles, MessageEditorStylesProps } from './message-editor.styles';

export interface MessageEditorProps {
  buttons?: ExtensionButton[];
  compactMode?: boolean;
  disabled?: boolean;
  error?: boolean;
  maxSymbols?: number;
  onChange?:(newValue: string) => void;
  onBlur?: EditorProviderProps['onBlur'];
  sx?: MessageEditorStylesProps['sx'];
  rootExtensions?: Extension[];
  value: string;
}

export const MessageEditor = forwardRef<
HTMLDivElement,
MessageEditorProps & Omit<HTMLAttributes<HTMLDivElement>, keyof MessageEditorProps>
>(({
  buttons = defaultButtons,
  className,
  disabled,
  error,
  compactMode,
  maxSymbols,
  onBlur,
  onChange,
  rootExtensions = defaultRootExtensions,
  sx,
  value,
  ...htmlAttributes
}, ref) => {
  const extensions = useMemo(() => compact([
    ...rootExtensions,
    ...buttons.map(({ initialise }) => initialise?.()),
    ...maxSymbols
      ? [CharacterCount.configure({ limit: maxSymbols })]
      : [],
  ]), [
    buttons,
    maxSymbols,
    rootExtensions,
  ]);

  const getEditorProps = useCallback(() => ({
    attributes: { 'aria-invalid': error ? 'true' : 'false' },
  }), [error]);

  // hack because EditorProvider ignores changes of editorProps
  const editorPropsRef = useRef(getEditorProps());
  useEffect(() => {
    editorPropsRef.current = getEditorProps();
  }, [
    editorPropsRef,
    getEditorProps,
  ]);

  const editorProps: EditorProviderProps['editorProps'] = useMemo(() => ({
    attributes: () => ({
      ...editorPropsRef?.current?.attributes,
    }),
  }), []);

  const focusOnChild = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    const editableElement = event.currentTarget.querySelector(
      '[contenteditable]',
    );

    if (editableElement instanceof HTMLDivElement) {
      editableElement.focus();
    }

    event.preventDefault();
  }, []);

  const editor = useEditor({
    editable: !disabled,
    editorProps,
    extensions,
    content: value,
    onBlur,
    onUpdate: ({ editor: updatingEditor, transaction }) => {
      // it's probably a disabling state toggle
      if (!transaction.steps.length) {
        return;
      }

      onChange?.(updatingEditor.getHTML());
    },
  });

  useEffect(
    () => editor?.setEditable(!disabled),
    [
      disabled,
      editor,
    ],
  );

  useEffect(
    () => {
      if (editor?.getHTML() !== value) {
        editor?.commands.setContent(value);
      }
    },
    [
      editor,
      value,
    ],
  );

  return (
    <MessageEditorStyles
      aria-disabled={disabled}
      className={classNames({
        MessageEditorStyles__error: error,
        MessageEditorStyles__compactMode: compactMode,
        [className ?? '']: !!className,
      })}
      onMouseDown={focusOnChild}
      ref={ref}
      sx={sx}
      {...htmlAttributes}
    >
      {compactMode || !editor
        ? null
        : <MenuBar editor={editor} buttons={buttons} disabled={disabled} />}
      <EditorContent editor={editor} />
    </MessageEditorStyles>
  );
});
