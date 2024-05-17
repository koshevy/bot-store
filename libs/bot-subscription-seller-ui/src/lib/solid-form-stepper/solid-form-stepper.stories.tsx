import { faker } from '@faker-js/faker';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';
import CircularProgress from '@mui/joy/CircularProgress';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { SolidFormStepper } from './solid-form-stepper';

faker.seed(0);
const Story: Meta<typeof SolidFormStepper> = {
  component: SolidFormStepper,
  title: 'UI-Kit Candidates/SolidFormStepper',
  parameters: {
    layout: 'centered',
  },
};

export default Story;

export const InitialState: StoryObj<typeof SolidFormStepper> = {
  args: {
    steps: [
      {
        icon: <BadgeIcon />,
        onClick: action('onClick'),
        status: 'invalid',
        title: 'Credentials',
      },
      {
        icon: <PasswordIcon />,
        onClick: action('onClick'),
        status: 'valid',
        title: 'Credentials',
      },
      {
        icon: <CircularProgress size="sm" color="neutral" variant="soft" />,
        onClick: action('onClick'),
        status: 'preparing',
        title: 'Credentials',
      },
    ],
  },
};
