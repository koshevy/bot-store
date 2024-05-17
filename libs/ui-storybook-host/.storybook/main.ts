import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    '../../../libs/bot-subscription-seller-ui/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../libs/ui-dynamic-form/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@nx/react/plugins/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};

export default config;
