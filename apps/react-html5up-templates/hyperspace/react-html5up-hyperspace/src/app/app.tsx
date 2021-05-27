import React from 'react';
import {
  Navbar,
  INavbarProps,
} from '@react-html5up-components/hyperspace/navbar';

const list: INavbarProps['navList'] = [
  { title: 'Home' },
  { title: 'Products', active: true },
  { title: 'Profile' },
];

export const App = () => {
  return (
    <div style={{ padding: '100px', background: '#312450' }}>
      <Navbar title="MorajLab" navList={list} />
    </div>
  );
};

export default App;
