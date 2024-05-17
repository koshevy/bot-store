import Box, { BoxProps } from '@mui/joy/Box';
import { styled } from '@mui/joy/styles';

import { menuBarClasses } from './menu-bar';

export type MessageEditorStylesProps = BoxProps;

export const MessageEditorStyles = styled(Box)(({ theme }) => `
  box-shadow: ${theme.vars.shadow.xs};
  border: 1px solid ${theme.palette.neutral.outlinedBorder};
  border-radius: ${theme.vars.radius.md};
  font-family: ${theme.vars.fontFamily.display};
  background: ${theme.vars.palette.background.surface};
  overflow: hidden;
  line-height: ${theme.vars.lineHeight};
  cursor: text;
  font-size: ${theme.vars.fontSize.md};
  line-height: ${theme.vars.lineHeight.md};

  &[aria-disabled="true"] {
    border-color: ${theme.palette.neutral.outlinedDisabledBorder};
  }

  &:focus-within:not([aria-disabled="true"]):not(.MessageEditorStyles__error) {
    border-color: ${theme.vars.palette.focusVisible};
    outline: ${theme.vars.palette.focusVisible} 1px solid;
  }

  .${menuBarClasses.root} {
    padding: 0.25rem;
    background: ${theme.vars.palette.neutral['100']};
    height: auto;
  }

  &.MessageEditorStyles__error {
    border-color: ${theme.vars.palette.danger['400']};

    &:focus-within {
      outline: ${theme.vars.palette.danger['400']} 1px solid;
    }
  }

  .tiptap {
    padding: .05rem .8rem;

    &:focus {
      outline: none;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    code {
      padding: .1rem .2rem;
      border-radius: ${theme.radius.sm};
      font-family: ${theme.vars.fontFamily.code};
      background-color: ${theme.palette.danger.softBg};
      color: ${theme.palette.danger['600']};
    }

    pre {
      background: #0D0D0D;
      color: #FFF;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      margin-left: 0;
      padding: .4rem .4rem .4rem .8rem;
      background: ${theme.palette.primary['50']};
      border-left: .2rem solid ${theme.palette.primary['300']};
      font-size: ${theme.vars.fontSize.sm};
      color: ${theme.vars.palette.primary['700']};

      p {
        margin: 0;
        padding: 0;
      }
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0D0D0D, 0.1);
      margin: 2rem 0;
    }

    .Mark__TelegramHidden {
      background: transparent;
      filter: blur(3px);
      transition: filter ease .2s;
      border: ${theme.vars.palette.neutral.solidBg} 1px dashed;
      background: ${theme.vars.palette.neutral.softBg};

      &:hover, &:focus, &:active {
        filter: blur(0);
      }
    }
  }

  &[aria-disabled="true"] {
    .tiptap {
      opacity: .5;
    }
  }

  &.MessageEditorStyles__compactMode {
    .tiptap {
      padding: .5rem;
      font-size: ${theme.vars.fontSize.sm};
      line-height: ${theme.vars.lineHeight.sm};

      p {
        margin: 0 0 .5rem 0;
      }
    }
  }
`);
