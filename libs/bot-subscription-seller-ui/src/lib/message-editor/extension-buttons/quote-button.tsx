import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ExtensionBlockquote, { BlockquoteOptions } from '@tiptap/extension-blockquote';
import { Editor } from '@tiptap/react';

import {
  DefaultExtensionButtonWrapper,
  ExtensionButton,
} from '../extension-button-abstract';

export const quoteButton: ExtensionButton = {
  getIsActive: (editor: Editor) => editor.isActive('blockquote'),
  getIsDisabled: (editor: Editor) => !editor.can()
    .chain()
    .focus()
    .toggleBlockquote()
    .run(),
  surface: () => (
    <FormatQuoteIcon />
  ),
  initialise: () => ExtensionBlockquote.configure(),
  onClick: (editor: Editor) => {
    const italicOptions = editor.chain().focus().toggleBlockquote();

    if (!isItalicOptions(italicOptions)) {
      return;
    }

    italicOptions.run();
  },
  title: 'Quote block',
  wrapper: DefaultExtensionButtonWrapper,
};

function isItalicOptions(value: unknown): value is BlockquoteOptions {
  return typeof value === 'object' && !!value;
}
