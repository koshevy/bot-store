import { faker } from '@faker-js/faker';
import Button from '@mui/joy/Button';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

import {
  ActionMenu,
  useActionMenu,
} from './action-menu';

faker.seed(0);

const Story: Meta<typeof ActionMenu> = {
  component: ActionMenu,
  title: 'Bot Subscription Seller/ActionPanel/ActionMenu',
  parameters: {
    layout: 'centered',
  },

};

export default Story;

export const Open: StoryObj<typeof ActionMenu> = {
  args: {
    actions: Array.from({ length: 2 }).map(
      (...[, index]) => ({
        title: faker.commerce.productName(),
        onClick: action(`onClick:${index}`),
      }),
    ),
    isOpen: true,
  },
};

export const UseActionMenu: StoryFn<typeof ActionMenu> = ({ actions }) => {
  const {
    isOpen,
    menu,
    setIsOpen,
    setElement,
  } = useActionMenu({
    actions,
    isInitiallyOpen: true,
  });

  return (
    <div>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        ref={(element) => setElement(element)}
      >
        Button having menu
      </Button>
      {menu}
    </div>
  );
};
UseActionMenu.args = {
  actions: Open.args?.actions,
};
