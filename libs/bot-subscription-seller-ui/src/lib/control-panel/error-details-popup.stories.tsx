import { faker } from '@faker-js/faker';
import Button from '@mui/joy/Button';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect, useState } from 'react';

import {
  ErrorDetailPopup,
} from './error-details-popup';

faker.seed(0);

const Story: Meta<typeof ErrorDetailPopup> = {
  component: ErrorDetailPopup,
  title: 'Bot Subscription Seller/ActionPanel/ErrorDetailPopup',
  parameters: {
    layout: 'centered',
  },

};

export default Story;

export const Open: StoryFn<typeof ErrorDetailPopup> = ({ open, ...args }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    if (isOpen !== open) {
      setIsOpen(open);
    }
  }, [
    isOpen,
    open,
    setIsOpen,
  ]);

  return (
    <ErrorDetailPopup {...args} open={isOpen}>
      <Button
        color="danger"
        onClick={() => setIsOpen(!isOpen)}
      >
        Toggle details
      </Button>
    </ErrorDetailPopup>
  );
};
Open.args = {
  errorDetails: [
    {
      path: 'paymentToken',
      message: 'This payment token is wrong!',
      value: faker.string.numeric(10),
    },
    {
      path: 'privateChannelID',
      message: 'Bot can\'t find channel with this ID. Is it real?',
      value: faker.string.numeric(10),
    },
  ],
  onClose: action('onClose'),
  open: true,
  placement: 'right',
};
