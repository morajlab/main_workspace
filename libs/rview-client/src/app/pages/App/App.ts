import r from '@moraj/react-hyper/r';
import { Base, Body, TopBar } from '../../components';
import styles from './App.style';

const App = r(
  Base,
  {
    styles: styles(),
  },
  [r(TopBar), r(Body)]
);

export default App;
