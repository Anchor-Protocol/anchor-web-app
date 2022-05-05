import type { DefaultTheme } from 'styled-components';
import {
  defaultLightTheme,
  LIGHT_GRAY_300,
  BLACK,
  WHITE,
} from '../lightThemeDefault';

// const PRIMARY_1000 = '#1E1702';
const PRIMARY_900 = '#453603';
const PRIMARY_800 = '#765A04';
const PRIMARY_700 = '#A88000';
const PRIMARY_600 = '#D0980B';
const PRIMARY_500 = '#F0B909';
// const PRIMARY_400 = '#FFCD2A';
// const PRIMARY_300 = '#FFD857';
const PRIMARY_200 = '#FFE388';
const PRIMARY_100 = '#FFEFBB';

const GRAY_700 = '#151515';
const GRAY_600 = '#707070';
const GRAY_500 = '#A4A4A4';
const GRAY_400 = '#B7B7B7';
// const GRAY_300 = '#DFDFDF';
// const GRAY_200 = '#F0F0F0';
const GRAY_100 = '#F7F7F7';

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
    textColor: WHITE,
    navigationTextColor: 'hsla(0, 0%, 8%, 0.4)',
  },
  messageBox: {
    borderColor: PRIMARY_500,
    backgroundColor: PRIMARY_100,
    textColor: PRIMARY_900,
    linkColor: PRIMARY_500,
  },
  actionButton: {
    backgroundColor: GRAY_700,
    backgroundHoverColor: GRAY_600,
    textColor: GRAY_100,
    hoverTextColor: GRAY_100,
  },
  borderButton: {
    borderColor: GRAY_700,
    borderHoverColor: GRAY_600,
    textColor: GRAY_700,
    hoverTextColor: GRAY_600,
  },
  tooltip: {
    ...defaultLightTheme.tooltip,
    normal: {
      backgroundColor: PRIMARY_200,
      textColor: LIGHT_GRAY_300,
    },
  },
};
