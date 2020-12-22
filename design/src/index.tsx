import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { lightTheme } from '@anchor-protocol/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { Borrow } from 'pages/borrow';
import { Market } from 'pages/market';
import React from 'react';
import ReactDOM from 'react-dom';
import { Earn } from 'pages/earn';
import { Neumorphism } from 'pages/neumorphism';

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
      <ThemeProvider theme={lightTheme}>
        <Market />
      </ThemeProvider>
      <ThemeProvider theme={darkTheme}>
        <Borrow />
      </ThemeProvider>
    </div>
  );
}

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
