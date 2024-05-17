import { faker } from '@faker-js/faker';
import BadgeIcon from '@mui/icons-material/Badge';
import PasswordIcon from '@mui/icons-material/Password';
import CircularProgress from '@mui/joy/CircularProgress';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { FormStep } from './form-step';

faker.seed(0);
const Story: Meta<typeof FormStep> = {
  component: FormStep,
  title: 'UI-Kit Candidates/SolidFormStepper/Step',
  parameters: {
    layout: 'centered',
  },
};

export default Story;

export const InvalidStep: StoryObj<typeof FormStep> = {
  args: {
    icon: <BadgeIcon />,
    onClick: action('onClick'),
    status: 'invalid',
    title: 'Credentials',
  },
};

export const ValidStep: StoryObj<typeof FormStep> = {
  args: {
    icon: <PasswordIcon />,
    onClick: action('onClick'),
    status: 'valid',
    title: 'Credentials',
  },
};

export const PreparingStep: StoryObj<typeof FormStep> = {
  args: {
    icon: <CircularProgress size="sm" color="neutral" variant="soft" />,
    onClick: action('onClick'),
    status: 'preparing',
    title: 'Credentials',
  },
};
