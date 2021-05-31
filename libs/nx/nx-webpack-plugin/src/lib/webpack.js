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

  const resultConfig = {
    ...config,
    node: { global: true, fs: 'empty' },
  };

  if (context) {
    return resultConfig;
  }

  return {
    config: resultConfig,
    tools: {
      getRule: (pattern) => getRule(resultConfig, pattern),
    },
  };
};
