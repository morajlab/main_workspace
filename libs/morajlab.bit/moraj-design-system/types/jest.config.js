module.exports = {
  displayName: 'morajlab.bit-moraj-design-system-types',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/morajlab.bit/moraj-design-system/types',
};
