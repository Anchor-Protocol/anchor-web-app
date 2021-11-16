import React from 'react';
import { darkTheme } from '../src/@libs/neumorphism-ui/themes/darkTheme';
import {
  globalStyle,
  GlobalStyle,
} from '../src/@libs/neumorphism-ui/themes/GlobalStyle';
import { lightTheme } from '../src/@libs/neumorphism-ui/themes/lightTheme';
import { ThemeProvider } from '../src/@libs/neumorphism-ui/themes/ThemeProvider';
import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme,
  },
  backgrounds: {
    default: 'light',
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
        globals?.backgrounds?.value === darkTheme.backgroundColor
          ? darkTheme
          : lightTheme
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
