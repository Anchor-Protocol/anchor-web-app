import { createGlobalStyle, css } from 'styled-components';

export const globalStyle = css`
  html,
  body {
    margin: 0;
  }

  html {
    font-family: Gotham, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    font-family: Gotham, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;
