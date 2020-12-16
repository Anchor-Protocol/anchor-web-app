import { Neumorphism } from './pages/neumorphism';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Earn } from './pages/earn';

function App() {
  return (
    <div>
      <Neumorphism />
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
