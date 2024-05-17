import TerminalIcon from '@mui/icons-material/Terminal';
import ExtensionCodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block';
import { Editor } from '@tiptap/react';

import {
  DefaultExtensionButtonWrapper,
  ExtensionButton,
} from '../extension-button-abstract';

export const codeBlockButton: ExtensionButton = {
  getIsActive: (editor: Editor) => editor.isActive('codeBlock'),
  getIsDisabled: (editor: Editor) => !editor.can()
    .chain()
    .focus()
    .toggleCodeBlock()
    .run(),
  surface: () => (
    <TerminalIcon />
  ),
  initialise: () => ExtensionCodeBlock.configure(),
  onClick: (editor: Editor) => {
    const codeOptions = editor.chain().focus().toggleCodeBlock();

    if (!isBoldOptions(codeOptions)) {
      return;
    }

    codeOptions.run();
  },
  title: 'Code Block',
  wrapper: DefaultExtensionButtonWrapper,
};

function isBoldOptions(value: unknown): value is CodeBlockOptions {
  return typeof value === 'object' && !!value;
}
