import type { DefaultTheme } from 'styled-components';
import {
  defaultDarkTheme,
  WHITE,
  BLACK,
  DARK_GRAY_100,
} from '../darkThemeDefault';

// TERRA THEME
const GREEN_100 = '#15cc93';
const GREEN_200 = '#4BDB4B';
const GREEN_300 = 'rgba(75, 219, 75, 0.1)';
const GREEN_400 = '#285e28';
const GREEN_500 = '#36a337';
const GREEN_600 = '#2d832d';
const GREEN_700 = '#246d25';
const GREEN_800 = '#174f1a';
const GREEN_900 = '#0e3311';
const RED_100 = '#e95979';
const YELLOW_100 = '#ff9a63';
const GRAY_200 = '#101010';

export const darkTheme: DefaultTheme = {
  ...defaultDarkTheme,
  // VARIABLES (SHOULD BE CHANGED)
  textColor: WHITE,
  dimTextColor: DARK_GRAY_100,

  colors: {
    positive: GREEN_100,
    negative: RED_100,
    warning: YELLOW_100,
    primary: GREEN_100,
    primaryDark: GREEN_100,
    secondary: GREEN_100,
    secondaryDark: GREEN_100,
  },

  header: {
    backgroundColor: BLACK,
    textColor: GREEN_200,
  },

  messageBox: {
    borderColor: GREEN_200,
    backgroundColor: GREEN_300,
    textColor: GREEN_400,
    linkColor: GREEN_200,
  },

  chart: [
    GREEN_200,
    GREEN_500,
    GREEN_600,
    GREEN_700,
    GREEN_800,
    GREEN_900,
    GRAY_200,
  ],
};
