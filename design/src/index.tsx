import React from 'react';
import ReactDOM from 'react-dom';
import { Earn } from './pages/earn';
import './index.scss';

function App() {
  return (
    <div>
      <Earn />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
