import { Document } from '@tiptap/extension-document';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { Gapcursor } from '@tiptap/extension-gapcursor';
import { HardBreak } from '@tiptap/extension-hard-break';
import { History } from '@tiptap/extension-history';
import { Link } from '@tiptap/extension-link';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Text } from '@tiptap/extension-text';

import {
  boldButton,
  codeButton,
  codeBlockButton,
  divider,
  hiddenTextButton,
  italicButton,
  quoteButton,
  strikeButton,
  underlineButton,
} from './extension-buttons';

export const defaultButtons = [
  boldButton,
  italicButton,
  underlineButton,
  strikeButton,
  codeButton,
  hiddenTextButton,
  divider,
  quoteButton,
  codeBlockButton,
];

export const defaultRootExtensions = [
  Document,
  Paragraph,
  Dropcursor,
  Gapcursor,
  HardBreak,
  History,
  Text,
  Link.configure({
    autolink: true,
    linkOnPaste: true,
  }),
];
