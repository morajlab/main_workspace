import r from '@moraj/react-hyper/r';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { initializeIcons } from '@uifabric/icons';
import App from './app/pages/App/App';

initializeIcons();

ReactDOM.render(
  r(React.StrictMode, r(BrowserRouter, App)),
  document.getElementById('root')
);
