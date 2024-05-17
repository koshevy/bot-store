import { faker } from '@faker-js/faker';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { createDraftArrayFixture } from './__fixtures__';
import { DraftList } from './draft-list';

faker.seed(0);

const Story: Meta<typeof DraftList> = {
  component: DraftList,
  title: 'Bot Subscription Seller/DraftList',
  parameters: {
    layout: 'centered',
  },
};

export default Story;

const draftListValueFixture = createDraftArrayFixture();

export const NoDrafts: StoryObj<typeof DraftList> = {
  args: {
    onSelect: action('onSelect'),
    onUpdate: action('onUpdate'),
  },
};

export const FewDrafts: StoryObj<typeof DraftList> = {
  args: {
    value: draftListValueFixture,
    onSelect: action('onSelect'),
    onUpdate: action('onUpdate'),
  },
};

export const FewDraftsWithSelected: StoryObj<typeof DraftList> = {
  args: {
    value: draftListValueFixture,
    selected: draftListValueFixture[1].uuid,
    onSelect: action('onSelect'),
    onUpdate: action('onUpdate'),
  },
};

export const FewDraftsWithHighlighted: StoryObj<typeof DraftList> = {
  args: {
    highlight: {
      draftUuid: draftListValueFixture[1].uuid,
      color: 'warning',
      text: 'Your previous state of form was stored here after force update from server!',
    },
    value: draftListValueFixture,
    onRemoveHighlight: action('onRemoveHighlight'),
    onSelect: action('onSelect'),
    onUpdate: action('onUpdate'),
  },
};

export const FewDraftsWithHighlightedButDisabled: StoryObj<typeof DraftList> = {
  args: {
    disabled: true,
    highlight: {
      draftUuid: draftListValueFixture[1].uuid,
      color: 'warning',
      text: 'Your previous state of form was stored here after force update from server!',
    },
    value: draftListValueFixture,
    onRemoveHighlight: action('onRemoveHighlight'),
    onSelect: action('onSelect'),
    onUpdate: action('onUpdate'),
  },
};
