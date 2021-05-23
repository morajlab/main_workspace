import { render } from '@testing-library/react';

import MorajlabBitMorajDesignSystemTypes from './morajlab.bit-moraj-design-system-types';

describe('MorajlabBitMorajDesignSystemTypes', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MorajlabBitMorajDesignSystemTypes />);
    expect(baseElement).toBeTruthy();
  });
});
