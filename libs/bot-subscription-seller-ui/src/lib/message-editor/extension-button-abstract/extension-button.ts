import { Editor, Mark, Node } from '@tiptap/react';
import {
  JSXElementConstructor,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react';

export interface ExtensionInitializer {
  initialise?: () => Mark | Node;
}

export interface ButtonWrapperProps {
  isActive?: boolean;
  isDisabled?: boolean;
  onClick: () => void;
  title: string;
}

export interface WrappedExtensionButton extends ExtensionInitializer {
  surface: () => (ReactElement | ReactNode);
  getIsActive: (editor: Editor) => boolean;
  getIsDisabled: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
  title: string;
  wrapper: JSXElementConstructor<
  PropsWithChildren<ButtonWrapperProps>
  >;
}

export interface RenderedExtensionButton extends ExtensionInitializer {
  render: (editor: Editor) => (ReactElement | ReactNode);
}

export type ExtensionButton = WrappedExtensionButton | RenderedExtensionButton;

export function isWrappedAbstractButton(
  button: ExtensionButton,
): button is WrappedExtensionButton {
  return 'wrapper' in button;
}
