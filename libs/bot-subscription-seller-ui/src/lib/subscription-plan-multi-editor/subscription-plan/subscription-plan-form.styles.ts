import CardContent from '@mui/joy/CardContent';
import { formLabelClasses } from '@mui/joy/FormLabel';
import { gridClasses } from '@mui/joy/Grid';
import { selectClasses } from '@mui/joy/Select';
import { styled, Theme } from '@mui/joy/styles';
import { switchClasses } from '@mui/joy/Switch';

import { erroredInputClasses } from '../errored-inputs';

export const SubscriptionPlanFormStyles = styled(CardContent)(({ theme }: { theme: Theme }) => `
  .${gridClasses.container} {
    width: 100%;
    padding-top: 0;
  }

  .${gridClasses.root}:not(.${gridClasses.container}) {
    position: relative;
  }

  .${formLabelClasses.root} {
    margin-bottom: .2rem;
  }

  .${switchClasses.root} {
    margin-top: .6rem;
  }

  .SubscriptionPlanForm__periodInput {
    padding-right: 0;

    .${erroredInputClasses.endDecorator} {
      flex-grow: 1;
    }

    .${selectClasses.root} {
      border-radius: 0 ${theme.radius.sm} ${theme.radius.sm} 0;
      width: 100%;
      min-height: 0;
    }
  }

  ${theme.breakpoints.up('lg')} {
    .SubscriptionPlanForm__description {
      width: 100%;
      position: absolute;
      height: 6.4rem;
    }
  }

  ${theme.breakpoints.down('lg')} {
    .SubscriptionPlanForm__description {
      height: 5rem;
    }
  }
`);
