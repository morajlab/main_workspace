import { assign } from './object-assign';

describe('objectAssign', () => {
  it('should work', () => {
    assign(
      {
        first: 'apple',
        second: 'bnana',
      },
      {
        first: 'rund',
        third: 'hahha',
      }
    );
  });
});
