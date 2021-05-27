import React from 'react';
import { Radio } from '@react-html5up-components/hyperspace/radio';

export const App = () => {
  return (
    <div style={{ padding: '100px', background: '#312450' }}>
      <Radio
        id="firstRadio"
        label="First radio"
        name="demo-radio"
        checked
        onChange={() => {
          console.log('hello workd');
        }}
      />
      <Radio
        id="secondRadio"
        label="Second radio"
        name="demo-radio"
        onChange={() => {
          console.log('hello workd');
        }}
      />
      <Radio
        id="thirdRadio"
        label="Third radio"
        name="demo-radio"
        onChange={() => {
          console.log('hello workd');
        }}
      />
    </div>
  );
};

export default App;
