import {
  StylesProvider as MuiStylesProvider,
  ThemeProvider as MuiThemeProvider,
} from '@material-ui/core/styles';
import React, { ReactNode } from 'react';
import type { DefaultTheme } from 'styled-components';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';

export interface ThemeProviderProps {
  children: ReactNode;
  injectFirst?: boolean;
  theme: DefaultTheme;
}

export function ThemeProvider({
  children,
  injectFirst = true,
  theme,
}: ThemeProviderProps) {
  return (
    <MuiStylesProvider injectFirst={injectFirst}>
      <StyledComponentsThemeProvider theme={theme}>
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
      </StyledComponentsThemeProvider>
    </MuiStylesProvider>
  );
}
