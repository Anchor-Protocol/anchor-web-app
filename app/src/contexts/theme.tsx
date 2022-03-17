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
  lightTheme: DefaultTheme;
  darkTheme?: DefaultTheme;
}

export interface ThemeState {
  themeColor: ThemeColor;
  theme: DefaultTheme;
  switchable: boolean;
  updateTheme: (themeColor: ThemeColor) => void;
}

// @ts-ignore
const ThemeContext: Context<ThemeState> = createContext<ThemeState>();

const storageKey = '__anchor_theme__';

export function ThemeProvider(props: ThemeProviderProps) {
  const { children, initialTheme, lightTheme, darkTheme } = props;

  const [themeColor, setThemeColor] = useState<ThemeColor>(
    () => (localStorage.getItem(storageKey) ?? initialTheme) as ThemeColor,
  );

  const updateTheme = useCallback((color: ThemeColor) => {
    setThemeColor(color);
    localStorage.setItem(storageKey, color);
  }, []);

  const state = useMemo<ThemeState>(
    () => ({
      themeColor,
      theme: themeColor === 'dark' && darkTheme ? darkTheme : lightTheme,
      switchable: darkTheme !== undefined,
      updateTheme,
    }),
    [themeColor, updateTheme, lightTheme, darkTheme],
  );

  return (
    <ThemeContext.Provider value={state}>
      <NeumorphismThemeProvider theme={state.theme}>
        {children}
      </NeumorphismThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  return useContext(ThemeContext);
}

export const ThemeConsumer: Consumer<ThemeState> = ThemeContext.Consumer;
