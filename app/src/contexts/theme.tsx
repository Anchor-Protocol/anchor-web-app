import { Chain, useDeploymentTarget } from '@anchor-protocol/app-provider';
import { darkTheme as terraDarkTheme } from '@libs/neumorphism-ui/themes/terra/darkTheme';
import { lightTheme as terraLightTheme } from '@libs/neumorphism-ui/themes/terra/lightTheme';
import { darkTheme as ethereumDarkTheme } from '@libs/neumorphism-ui/themes/ethereum/darkTheme';
import { lightTheme as ethereumLightTheme } from '@libs/neumorphism-ui/themes/ethereum/lightTheme';
import { ThemeProvider as NeumorphismThemeProvider } from '@libs/neumorphism-ui/themes/ThemeProvider';
import type { ReactNode } from 'react';
import React, {
  Consumer,
  Context,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { DefaultTheme } from 'styled-components';

type ThemeColor = 'light' | 'dark';

export interface ThemeProviderProps {
  children: ReactNode;
  initialTheme: ThemeColor;
}

export interface ThemeState {
  themeColor: ThemeColor;
  theme: DefaultTheme;
  updateTheme: (themeColor: ThemeColor) => void;
}

// @ts-ignore
const ThemeContext: Context<ThemeState> = createContext<ThemeState>();

const storageKey = '__anchor_theme__';

function getLightTheme(chain: Chain) {
  switch (chain) {
    case Chain.Terra:
      return terraLightTheme;
    case Chain.Ethereum:
      return ethereumLightTheme;
  }
}

function getDarkTheme(chain: Chain) {
  switch (chain) {
    case Chain.Terra:
      return terraDarkTheme;
    case Chain.Ethereum:
      return ethereumDarkTheme;
  }
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const { chain } = useDeploymentTarget();

  const [themeColor, setThemeColor] = useState<ThemeColor>(
    () => (localStorage.getItem(storageKey) ?? initialTheme) as ThemeColor,
  );

  const theme = useMemo(() => {
    return themeColor === 'dark' ? getDarkTheme(chain) : getLightTheme(chain);
  }, [chain, themeColor]);

  const updateTheme = useCallback((theme: ThemeColor) => {
    setThemeColor(theme);
    localStorage.setItem(storageKey, theme);
  }, []);

  const state = useMemo<ThemeState>(
    () => ({
      themeColor,
      theme,
      updateTheme,
    }),
    [theme, themeColor, updateTheme],
  );

  return (
    <ThemeContext.Provider value={state}>
      <NeumorphismThemeProvider theme={theme}>
        {children}
      </NeumorphismThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  return useContext(ThemeContext);
}

export const ThemeConsumer: Consumer<ThemeState> = ThemeContext.Consumer;
