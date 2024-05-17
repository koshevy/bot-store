import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ExtensionUnderline, { UnderlineOptions } from '@tiptap/extension-underline';
import { Editor } from '@tiptap/react';

import {
  DefaultExtensionButtonWrapper,
  ExtensionButton,
} from '../extension-button-abstract';

export const underlineButton: ExtensionButton = {
  getIsActive: (editor: Editor) => editor.isActive('underline'),
  getIsDisabled: (editor: Editor) => !editor.can()
    .chain()
    .focus()
    .toggleUnderline()
    .run(),
  surface: () => (
    <FormatUnderlinedIcon />
  ),
  initialise: () => ExtensionUnderline.configure(),
  onClick: (editor: Editor) => {
    const italicOptions = editor.chain().focus().toggleUnderline();

    if (!isItalicOptions(italicOptions)) {
      return;
    }

    italicOptions.run();
  },
  title: 'Underline',
  wrapper: DefaultExtensionButtonWrapper,
};

function isItalicOptions(value: unknown): value is UnderlineOptions {
  return typeof value === 'object' && !!value;
}
