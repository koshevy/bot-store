import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import ExtensionBold, { ItalicOptions } from '@tiptap/extension-italic';
import { Editor } from '@tiptap/react';

import {
  DefaultExtensionButtonWrapper,
  ExtensionButton,
} from '../extension-button-abstract';

export const italicButton: ExtensionButton = {
  getIsActive: (editor: Editor) => editor.isActive('italic'),
  getIsDisabled: (editor: Editor) => !editor.can()
    .chain()
    .focus()
    .toggleItalic()
    .run(),
  surface: () => (
    <FormatItalicIcon />
  ),
  initialise: () => ExtensionBold.configure(),
  onClick: (editor: Editor) => {
    const italicOptions = editor.chain().focus().toggleItalic();

    if (!isItalicOptions(italicOptions)) {
      return;
    }

    italicOptions.run();
  },
  title: 'Italic',
  wrapper: DefaultExtensionButtonWrapper,
};

function isItalicOptions(value: unknown): value is ItalicOptions {
  return typeof value === 'object' && !!value;
}
