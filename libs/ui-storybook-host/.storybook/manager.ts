import { addons } from '@storybook/manager-api';

addons.setConfig({
  rightPanelWidth: 800,
  panelPosition: 'right',
  enableShortcuts: true,
  showToolbar: true,
  selectedPanel: 'storybook/interactions/panel',
  initialActive: 'sidebar',
});
