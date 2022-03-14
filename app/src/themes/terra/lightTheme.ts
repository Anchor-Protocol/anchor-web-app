import type { DefaultTheme } from 'styled-components';
import {
  defaultLightTheme,
  BASE_GRAY_300,
  BASE_GRAY_600,
  BLACK,
} from '../themeHelper';

const SECONDARY_200 = '#285e28';
const SECONDARY_300 = 'rgba(75, 219, 75, 0.1)';
const SECONDARY_400 = '#4BDB4B';
const SECONDARY_500 = '#36a337';
const SECONDARY_600 = '#2d832d';
const SECONDARY_700 = '#246d25';
const SECONDARY_800 = '#174f1a';
const SECONDARY_900 = '#0e3311';

const GRAY_400 = '#101010';

export const lightTheme: DefaultTheme = {
  ...defaultLightTheme,

  textColor: BASE_GRAY_300,
  dimTextColor: BASE_GRAY_600,
  colors: {
    ...defaultLightTheme.colors,
    positive: SECONDARY_400,
    primary: SECONDARY_400,
    primaryDark: SECONDARY_400,
    secondary: SECONDARY_400,
    secondaryDark: SECONDARY_400,
  },
  chart: [
    SECONDARY_400,
    SECONDARY_500,
    SECONDARY_600,
    SECONDARY_700,
    SECONDARY_800,
    SECONDARY_900,
    GRAY_400,
  ],
  header: {
    backgroundColor: BLACK,
    textColor: SECONDARY_400,
  },
  messageBox: {
    borderColor: SECONDARY_400,
    backgroundColor: SECONDARY_300,
    textColor: SECONDARY_200,
    linkColor: SECONDARY_400,
  },
  // errorTextColor: BASE_RED_200,
  // positiveTextColor: SECONDARY_400,
  // pointColor: SECONDARY_400,
};
