import CodeIcon from '@mui/icons-material/Code';
import ExtensionCode, { CodeOptions } from '@tiptap/extension-code';
import { Editor } from '@tiptap/react';

import {
  DefaultExtensionButtonWrapper,
  ExtensionButton,
} from '../extension-button-abstract';

export const codeButton: ExtensionButton = {
  getIsActive: (editor: Editor) => editor.isActive('code'),
  getIsDisabled: (editor: Editor) => !editor.can()
    .chain()
    .focus()
    .toggleCode()
    .run(),
  surface: () => (
    <CodeIcon />
  ),
  initialise: () => ExtensionCode.configure(),
  onClick: (editor: Editor) => {
    const codeOptions = editor.chain().focus().toggleCode();

    if (!isBoldOptions(codeOptions)) {
      return;
    }

    codeOptions.run();
  },
  title: 'Code',
  wrapper: DefaultExtensionButtonWrapper,
};

function isBoldOptions(value: unknown): value is CodeOptions {
  return typeof value === 'object' && !!value;
}
