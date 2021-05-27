import React from 'react';
import {
  Table,
  ITableDataProps,
} from '@react-html5up-components/hyperspace/table';

const data: ITableDataProps = {
  head: ['First col', 'Second col', 'Third col'],
  body: [
    ['first 1', 'second 1', 'third 1'],
    ['first 2', 'second 2', 'third 2'],
    ['first 3', 'second 3', 'third 3'],
  ],
  foot: ['First col', 'Second col', 'Third col'],
};

export const App = () => {
  return (
    <div style={{ padding: '100px', background: '#312450' }}>
      <Table data={data} />
    </div>
  );
};

export default App;
