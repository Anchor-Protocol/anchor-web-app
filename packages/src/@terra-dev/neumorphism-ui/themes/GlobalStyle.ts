import { NeumorphismTheme } from './Theme';
import { createGlobalStyle, css } from 'styled-components';

function bodyStyleIfThemeExists(theme?: NeumorphismTheme): string {
  if (!theme) return '';

  const styles = [];

  if (theme?.backgroundColor) {
    styles.push(`background-color: ${theme.backgroundColor};`);
  }

  if (theme?.textColor) {
    styles.push(`color: ${theme.textColor};`);
  }

  return `body { ${styles.join('')} }`;
}

export const globalStyle = css`
  html,
  body {
    margin: 0;
  }

  ${({ theme }) => bodyStyleIfThemeExists(theme)};

  html {
    font-family: 'Gotham SSm A', 'Gotham SSm B', BlinkMacSystemFont, 'Segoe UI',
      'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
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
    font-family: 'Gotham SSm A', 'Gotham SSm B', BlinkMacSystemFont, 'Segoe UI',
      'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', sans-serif;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;
