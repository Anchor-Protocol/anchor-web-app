import type { DefaultTheme } from 'styled-components';
import {
  defaultLightTheme,
  LIGHT_GRAY_300,
  BLACK,
  GRAY_400,
  GRAY_500,
  GRAY_700,
} from '../lightThemeDefault';

const PRIMARY_950 = '#1E1702';
const PRIMARY_900 = '#453603';
const PRIMARY_800 = '#765A04';
const PRIMARY_700 = '#A88000';
const PRIMARY_600 = '#D0980B';
const PRIMARY_500 = '#F0B909';
const PRIMARY_400 = '#FFCD2A';
// const PRIMARY_300 = '#FFD857';
const PRIMARY_200 = '#FFE388';
const PRIMARY_100 = '#FFEFBB';

const POSITIVE = '#4BCA6C';
const NEGATIVE = '#EC6597';

/* eslint-enable */

export const lightTheme: DefaultTheme = {
  ...defaultLightTheme,

  textColor: GRAY_700,
  dimTextColor: GRAY_500,
  colors: {
    ...defaultLightTheme.colors,
    positive: POSITIVE,
    negative: NEGATIVE,
    primary: PRIMARY_500,
    primaryDark: PRIMARY_600,
    secondary: PRIMARY_500,
    secondaryDark: PRIMARY_600,
  },
  chart: [
    PRIMARY_500,
    PRIMARY_500,
    PRIMARY_600,
    PRIMARY_700,
    PRIMARY_800,
    PRIMARY_900,
    BLACK,
    GRAY_400,
  ],
  header: {
    backgroundColor: PRIMARY_500,
    textColor: PRIMARY_950,
    navigationTextColor: 'hsla(0, 0%, 8%, 0.4)',
  },
  messageBox: {
    borderColor: PRIMARY_500,
    backgroundColor: PRIMARY_100,
    textColor: PRIMARY_900,
    linkColor: PRIMARY_500,
  },
  actionButton: {
    backgroundColor: PRIMARY_950,
    backgroundHoverColor: PRIMARY_900,
    textColor: PRIMARY_500,
    hoverTextColor: PRIMARY_400,
  },
  borderButton: {
    borderColor: PRIMARY_600,
    borderHoverColor: PRIMARY_700,
    textColor: PRIMARY_600,
    hoverTextColor: PRIMARY_700,
    hoverBackgroundColor: 'transparent',
  },
  tooltip: {
    ...defaultLightTheme.tooltip,
    normal: {
      backgroundColor: PRIMARY_200,
      textColor: LIGHT_GRAY_300,
    },
  },
};
