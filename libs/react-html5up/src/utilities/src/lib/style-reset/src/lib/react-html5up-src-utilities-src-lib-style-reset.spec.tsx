import { render } from '@testing-library/react';

import ReactHtml5upSrcUtilitiesSrcLibStyleReset from './react-html5up-src-utilities-src-lib-style-reset';

describe('ReactHtml5upSrcUtilitiesSrcLibStyleReset', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ReactHtml5upSrcUtilitiesSrcLibStyleReset />
    );
    expect(baseElement).toBeTruthy();
  });
});
