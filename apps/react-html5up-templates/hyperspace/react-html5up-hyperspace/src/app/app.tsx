import React, { Fragment } from 'react';
import { SideNav } from '@react-html5up-components/hyperspace/sidenav';

export const App = () => {
  return (
    <SideNav
      navsList={[
        { title: 'First' },
        { title: 'Home', active: true },
        { title: 'FAQ' },
        { title: 'About us' },
      ]}
    />
  );
};

export default App;
