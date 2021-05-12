import React from 'react';
import { render } from '@testing-library/react';
import { BasicCommandbar } from './commandbar.composition';

describe('commandbar', () => {
  it('should render with the correct text', () => {
    const { getByText } = render(<BasicCommandbar />);
    const rendered = getByText('hello from Commandbar');
    expect(rendered).toBeTruthy();
  });
});
