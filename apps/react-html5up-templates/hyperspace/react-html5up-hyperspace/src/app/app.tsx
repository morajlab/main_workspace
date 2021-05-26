import React from 'react';
import { List } from '@react-html5up-components/hyperspace/list';

export const App = () => {
  return (
    <div style={{ padding: '100px', background: '#312450' }}>
      <List type="ordered" items={['first', 'second', 'third']} />
      <List type="unordered" items={['first', 'second', 'third']} />
      <List type="alternate" items={['first', 'second', 'third']} />
    </div>
  );
};

export default App;
