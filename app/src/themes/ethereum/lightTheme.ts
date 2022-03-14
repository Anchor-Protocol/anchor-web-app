import type { DefaultTheme } from 'styled-components';
import { defaultLightTheme, BASE_GRAY_300, BLACK, WHITE } from '../themeHelper';

/* eslint-disable */

const PRIMARY_1000 = '#48386A';
const PRIMARY_900 = '#614C8C';
const PRIMARY_800 = '#7C5FB5';
const PRIMARY_700 = '#987ECC';
const PRIMARY_600 = '#AB93DB';
const PRIMARY_500 = '#BEA9E8';
const PRIMARY_400 = '#CBB5F7';
const PRIMARY_300 = '#D9C7FC';
const PRIMARY_200 = '#EBDEFF';
const PRIMARY_100 = '#F2EBFF';

const SECONDARY_900 = '#4A5C7E';
const SECONDARY_800 = '#4D6592';
const SECONDARY_700 = '#5675AE';
const SECONDARY_600 = '#5E81C1';
const SECONDARY_500 = '#7493CC';
const SECONDARY_400 = '#8AA7DB';
const SECONDARY_300 = '#9EBBEF';
const SECONDARY_200 = '#B9D2FC';
const SECONDARY_100 = '#D0E2FE';

const GRAY_700 = '#3E4060';
const GRAY_600 = '#5B5E80';
const GRAY_500 = '#9E9FB3';
const GRAY_400 = '#B9BAC9';
const GRAY_300 = '#E3E4E5';
const GRAY_200 = '#F0F0F0';
const GRAY_100 = '#F6F6F7';
/* eslint-enable */

export const lightTheme: DefaultTheme = {
  ...defaultLightTheme,

  textColor: GRAY_700,
  dimTextColor: GRAY_500,
  colors: {
    ...defaultLightTheme.colors,
    positive: PRIMARY_500,
    primary: PRIMARY_400,
    primaryDark: PRIMARY_500,
    secondary: SECONDARY_500,
    secondaryDark: SECONDARY_700,
  },
  chart: [
    PRIMARY_500,
    SECONDARY_500,
    SECONDARY_600,
    SECONDARY_700,
    SECONDARY_800,
    SECONDARY_900,
    BLACK,
    GRAY_400,
  ],
  header: {
    backgroundColor: GRAY_700,
    textColor: PRIMARY_500,
  },
  messageBox: {
    borderColor: SECONDARY_500,
    backgroundColor: SECONDARY_100,
    textColor: SECONDARY_900,
    linkColor: SECONDARY_500,
  },
  actionButton: {
    backgroundColor: GRAY_700,
    backgroundHoverColor: GRAY_600,
    textColor: WHITE,
    hoverTextColor: WHITE,
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
      textColor: BASE_GRAY_300,
    },
  },
};
