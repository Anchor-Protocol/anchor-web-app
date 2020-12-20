import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { lightTheme } from '@anchor-protocol/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { MaterialUI } from 'pages/material';
import React from 'react';
import ReactDOM from 'react-dom';
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
    <GlobalStyle />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
