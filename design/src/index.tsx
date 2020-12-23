import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
import { GlobalStyle } from '@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { lightTheme } from '@anchor-protocol/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { Mint } from 'pages/basset/mint';
import { Borrow } from 'pages/borrow';
import { Earn } from 'pages/earn';
import { Market } from 'pages/market';
import { Neumorphism } from 'pages/neumorphism';
import { render } from 'react-dom';

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
      <ThemeProvider theme={darkTheme}>
        <Mint />
      </ThemeProvider>
    </div>
  );
}

render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
