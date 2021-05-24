import { render } from '@testing-library/react';

import ReactHtml5upSrcComponentsSrcLibHyperspace from './react-html5up-src-components-src-lib-hyperspace';

describe('ReactHtml5upSrcComponentsSrcLibHyperspace', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ReactHtml5upSrcComponentsSrcLibHyperspace />
    );
    expect(baseElement).toBeTruthy();
  });
});
