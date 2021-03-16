// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path');

module.exports = {
  cssFile: resolve(__dirname, 'src/styles.css'),
  configs: {
    namespace: '#atomic',
    classNames: []
  },
};
