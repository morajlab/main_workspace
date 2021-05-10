import React from 'react';
import { render } from '@testing-library/react';

import UwpJs from './uwp.js';

describe('UwpJs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UwpJs />);
    expect(baseElement).toBeTruthy();
  });
});
