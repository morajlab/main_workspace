import React, { Fragment } from 'react';
import { Footer } from '@react-html5up-components/hyperspace/footer';

export const App = () => {
  return (
    <div style={{ padding: '100px', background: '#312450' }}>
      <Footer
        list={[
          '© Untitled. All rights reserved',
          <Fragment>
            © Untitled. All rights reserved <a href="#!">Google</a>
          </Fragment>,
        ]}
      />
    </div>
  );
};

export default App;
