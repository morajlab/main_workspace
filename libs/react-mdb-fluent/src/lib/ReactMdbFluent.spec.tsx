import { render } from '@testing-library/react';

import ReactMdbFluent from './ReactMdbFluent';

describe('ReactMdbFluent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactMdbFluent />);
    expect(baseElement).toBeTruthy();
  });
});
