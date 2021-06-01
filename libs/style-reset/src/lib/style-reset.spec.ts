import { styleReset } from './style-reset';

describe('styleReset', () => {
  it('should work', () => {
    expect(styleReset()).toEqual('style-reset');
  });
});
