import React from 'react';
import { Button } from '@react-html5up-components/hyperspace/button';
import { Icon, faCoffee } from '@react-html5up-components/hyperspace/icon';

export const App = () => {
  return (
    <div style={{ padding: '100px', background: '#2f82ff' }}>
      <Button title="Default Button" icon={faCoffee} primary />
      <Button title="Default Button" primary/>
    </div>
  );
};

export default App;
