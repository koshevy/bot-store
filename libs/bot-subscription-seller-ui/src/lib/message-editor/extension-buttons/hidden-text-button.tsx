import BlurOnIcon from '@mui/icons-material/BlurOn';
import ExtensionHighlight, { HighlightOptions } from '@tiptap/extension-highlight';
import { Editor } from '@tiptap/react';

import {
  DefaultExtensionButtonWrapper,
  ExtensionButton,
} from '../extension-button-abstract';

export const hiddenTextButton: ExtensionButton = {
  getIsActive: (editor: Editor) => editor.isActive('highlight'),
  getIsDisabled: (editor: Editor) => !editor.can()
    .chain()
    .focus()
    .toggleHighlight()
    .run(),
  surface: () => (
    <BlurOnIcon />
  ),
  initialise: () => ExtensionHighlight.configure({
    HTMLAttributes: {
      class: 'Mark__TelegramHidden',
    },
  }),
  onClick: (editor: Editor) => {
    const boldOptions = editor.chain().focus().toggleHighlight();

    if (!isBoldOptions(boldOptions)) {
      return;
    }

    boldOptions.run();
  },
  title: 'Hidden text',
  wrapper: DefaultExtensionButtonWrapper,
};

function isBoldOptions(value: unknown): value is HighlightOptions {
  return typeof value === 'object' && !!value;
}
