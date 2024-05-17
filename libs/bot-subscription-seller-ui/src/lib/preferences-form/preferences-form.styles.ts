import {
  linearProgressClasses,
} from '@mui/joy/LinearProgress';
import { styled } from '@mui/joy/styles';

export const PreferencesFormStyles = styled('form')`
  position: relative;
  z-index: 0;

  .${linearProgressClasses.root} {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    opacity: 0;
  }

  &.PreferencesForm__isLoading {
    .PreferencesForm__content {
      opacity: 0;
    }

    .${linearProgressClasses.root} {
      opacity: 1;
    }
  }

  &:not(.PreferencesForm__isLoading) {
    .PreferencesForm__content {
      animation: appear 700ms ease-in-out;
    }

    .${linearProgressClasses.root} {
      animation: disappear 700ms ease-in-out !important;
    }
  }

  @keyframes appear {
    from {
      opacity: 0;
    }

    75% {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes disappear {
    from {
      opacity: 1;
    }

    75% {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
`;
