const { resolve } = require('path');
const { readdirSync, existsSync } = require('fs');
const { getRule } = require('./tools');
const nrwlConfig = require('@nrwl/react/plugins/webpack.js');

module.exports = (config, context = null) => {
  if (context) {
    const appsPath = resolve(context.buildOptions.root, 'apps');

    readdirSync(appsPath, { withFileTypes: true })
      .filter((direct) => direct.isDirectory())
      .forEach((dir) => {
        const webpackConfigPath = resolve(
          appsPath,
          dir.name,
          'webpack.config.js'
        );

        if (
          existsSync(webpackConfigPath) &&
          context.buildOptions.sourceRoot.includes(`apps/${dir.name}`)
        ) {
          const customConfig = require(webpackConfigPath);
          config = customConfig(config);
        }
      });

    nrwlConfig(config);
  }

  return Object.assign(
    {
      ...config,
      node: { global: true, fs: 'empty' },
    },
    context ? {} : { getRule: (pattern) => getRule(config, pattern) }
  );
};
