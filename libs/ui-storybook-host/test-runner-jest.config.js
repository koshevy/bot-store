const { getJestConfig } = require('@storybook/test-runner');

const testRunnerConfig = getJestConfig();

export default {
  ...testRunnerConfig,
  testTimeout: 25000,
  reporters:
    [
      'default',
      ['github-actions', { silent: false }],
    ],
};
