module.exports = {
  displayName: 'react-html5up-templates-hyperspace-react-html5up-hyperspace',
  preset: '../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/apps/react-html5up-templates/hyperspace/react-html5up-hyperspace',
};
