module.exports = {
  displayName: 'react-mdb-fluent-src-lib-component',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/react-mdb-fluent/src/lib/component',
};
