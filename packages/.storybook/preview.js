import { darkTheme } from '../src/@anchor-protocol/neumorphism-ui/themes/darkTheme';
import {
  globalStyle,
  GlobalStyle,
} from '../src/@anchor-protocol/neumorphism-ui/themes/GlobalStyle';
import { lightTheme } from '../src/@anchor-protocol/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '../src/@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme,
  },
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#1f2237',
      },
      {
        name: 'light',
        value: '#f4f4f5',
      },
    ],
  },
};

export const decorators = [
  (Story, { globals }) => (
    <ThemeProvider
      theme={
        globals?.backgrounds?.value === lightTheme.backgroundColor
          ? lightTheme
          : darkTheme
      }
    >
      <GlobalStyle />
      <DocGlobalStyle />
      <Story />
    </ThemeProvider>
  ),
];

export const DocGlobalStyle = createGlobalStyle`
  .docs-story {
    background-color: ${({ theme }) => theme.backgroundColor};
  }
`;
