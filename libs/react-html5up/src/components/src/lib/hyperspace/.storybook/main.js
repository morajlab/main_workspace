const rootMain = require('../../../../../../../../.storybook/main');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(
  ...['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)', '../docs/**/*.stories.mdx']
);

module.exports = rootMain;
