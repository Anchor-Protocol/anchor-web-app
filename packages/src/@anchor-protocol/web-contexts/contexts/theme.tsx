import { darkTheme } from '@anchor-protocol/neumorphism-ui/themes/darkTheme';
import { lightTheme } from '@anchor-protocol/neumorphism-ui/themes/lightTheme';
import { ThemeProvider as NeumorphismThemeProvider } from '@anchor-protocol/neumorphism-ui/themes/ThemeProvider';
import type { ReactNode } from 'react';
import {
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

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const [themeColor, setThemeColor] = useState<ThemeColor>(
    () => (localStorage.getItem(storageKey) ?? initialTheme) as ThemeColor,
  );

  const theme = useMemo(() => {
    return themeColor === 'dark' ? darkTheme : lightTheme;
  }, [themeColor]);

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
