import { darkTheme } from 'components/themes/darkTheme';
import { lightTheme } from 'components/themes/lightTheme';
import { ThemeProvider } from 'components/themes/ThemeProvider';
import { MaterialUI } from 'pages/material';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { Earn } from './pages/earn';
import { Neumorphism } from './pages/neumorphism';

function App() {
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Neumorphism />
      </ThemeProvider>
      <ThemeProvider theme={lightTheme}>
        <Neumorphism />
      </ThemeProvider>
      <ThemeProvider theme={darkTheme}>
        <Earn />
      </ThemeProvider>
      <ThemeProvider theme={darkTheme}>
        <MaterialUI />
      </ThemeProvider>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
