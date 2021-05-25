import { render } from '@testing-library/react';

import ReactHtml5upSrcComponentsSrcLibHyperspaceSrcLibIcon from './react-html5up-src-components-src-lib-hyperspace-src-lib-icon';

describe('ReactHtml5upSrcComponentsSrcLibHyperspaceSrcLibIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ReactHtml5upSrcComponentsSrcLibHyperspaceSrcLibIcon />
    );
    expect(baseElement).toBeTruthy();
  });
});
