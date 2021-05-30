import { render } from '@testing-library/react';

import ReactHtml5upSrcUtilities from './react-html5up-src-utilities';

describe('ReactHtml5upSrcUtilities', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactHtml5upSrcUtilities />);
    expect(baseElement).toBeTruthy();
  });
});
