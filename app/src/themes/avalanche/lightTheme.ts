import type { DefaultTheme } from 'styled-components';
import { defaultLightTheme, BASE_GRAY_300, BLACK, WHITE } from '../themeHelper';

/* eslint-disable */
const PRIMARY_1000 = '#2F2003';
const PRIMARY_900 = '#513705';
const PRIMARY_800 = '#855908';
const PRIMARY_700 = '#A16C09';
const PRIMARY_600 = '#B57B0E';
const PRIMARY_500 = '#F4A81A';
const PRIMARY_400 = '#F8B22F';
const PRIMARY_300 = '#F8BB4A';
const PRIMARY_200 = '#FBC869';
const PRIMARY_100 = '#FFD890';

const SECONDARY_900 = '#661515';
const SECONDARY_800 = '#8B1010';
const SECONDARY_700 = '#A50C0C';
const SECONDARY_600 = '#D11516';
const SECONDARY_500 = '#E84142';
const SECONDARY_400 = '#FF5F60';
const SECONDARY_300 = '#FF9394';
const SECONDARY_200 = '#FFB4B5';
const SECONDARY_100 = '#FAD7D8';

const GRAY_700 = '#151515';
const GRAY_600 = '#707070';
const GRAY_500 = '#A4A4A4';
const GRAY_400 = '#B7B7B7';
const GRAY_300 = '#DFDFDF';
const GRAY_200 = '#F0F0F0';
const GRAY_100 = '#F7F7F7';

const BLUE_100 = '#561DF4';

/* eslint-enable */

export const lightTheme: DefaultTheme = {
  ...defaultLightTheme,

  textColor: GRAY_700,
  dimTextColor: GRAY_500,
  colors: {
    ...defaultLightTheme.colors,
    positive: BLUE_100,
    negative: PRIMARY_500,
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
    backgroundColor: SECONDARY_500,
    textColor: WHITE,
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
      textColor: BASE_GRAY_300,
    },
  },
};
