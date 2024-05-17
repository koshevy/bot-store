import FormatBoldIcon from '@mui/icons-material/FormatBold';
import ExtensionBold, { BoldOptions } from '@tiptap/extension-bold';
import { Editor } from '@tiptap/react';

import {
  DefaultExtensionButtonWrapper,
  ExtensionButton,
} from '../extension-button-abstract';

export const boldButton: ExtensionButton = {
  getIsActive: (editor: Editor) => editor.isActive('bold'),
  getIsDisabled: (editor: Editor) => !editor.can()
    .chain()
    .focus()
    .toggleBold()
    .run(),
  surface: () => (
    <FormatBoldIcon />
  ),
  initialise: () => ExtensionBold.configure(),
  onClick: (editor: Editor) => {
    const boldOptions = editor.chain().focus().toggleBold();

    if (!isBoldOptions(boldOptions)) {
      return;
    }

    boldOptions.run();
  },
  title: 'Bold',
  wrapper: DefaultExtensionButtonWrapper,
};

function isBoldOptions(value: unknown): value is BoldOptions {
  return typeof value === 'object' && !!value;
}
