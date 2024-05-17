import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import ExtensionStrike, { StrikeOptions } from '@tiptap/extension-strike';
import { Editor } from '@tiptap/react';

import {
  DefaultExtensionButtonWrapper,
  ExtensionButton,
} from '../extension-button-abstract';

export const strikeButton: ExtensionButton = {
  getIsActive: (editor: Editor) => editor.isActive('strike'),
  getIsDisabled: (editor: Editor) => !editor.can()
    .chain()
    .focus()
    .toggleStrike()
    .run(),
  surface: () => (
    <FormatStrikethroughIcon />
  ),
  initialise: () => ExtensionStrike.configure(),
  onClick: (editor: Editor) => {
    const italicOptions = editor.chain().focus().toggleStrike();

    if (!isItalicOptions(italicOptions)) {
      return;
    }

    italicOptions.run();
  },
  title: 'Strikeout',
  wrapper: DefaultExtensionButtonWrapper,
};

function isItalicOptions(value: unknown): value is StrikeOptions {
  return typeof value === 'object' && !!value;
}
