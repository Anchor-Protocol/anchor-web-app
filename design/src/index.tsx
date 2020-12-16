import { darkTheme } from 'components/themes/darkTheme';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import './index.scss';
import { Earn } from './pages/earn';
import { Neumorphism } from './pages/neumorphism';

function App() {
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Neumorphism />
      </ThemeProvider>
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
