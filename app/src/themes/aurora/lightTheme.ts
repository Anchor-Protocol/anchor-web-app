import type { DefaultTheme } from 'styled-components';
import {
  defaultLightTheme,
  LIGHT_GRAY_300,
  BLACK,
  GRAY_400,
  WHITE,
} from '../lightThemeDefault';

const PRIMARY_950 = '#120523';
const PRIMARY_900 = '#3B0A4A';
// const PRIMARY_800 = '#781276';
// const PRIMARY_700 = '#A51A89';
const PRIMARY_600 = '#DD25A4';
const PRIMARY_500 = '#F82EAE';
// const PRIMARY_400 = '#FD49BE';
// const PRIMARY_300 = '#FE71DD';
const PRIMARY_200 = '#FF9CED';
const PRIMARY_100 = '#FED2FF';

const SECONDARY_900 = '#083006';
const SECONDARY_800 = '#246405';
const SECONDARY_700 = '#498E1A';
// const SECONDARY_600 = '#71B642';
const SECONDARY_500 = '#8FD460';
// const SECONDARY_400 = '#A3E874';
// const SECONDARY_300 = '#C1F592';
// const SECONDARY_200 = '#D1FAA2';
// const SECONDARY_100 = '#E4FFCC';

const POSITIVE = '#1969FF';
const NEGATIVE = '#EC6597';

export const lightTheme: DefaultTheme = {
  ...defaultLightTheme,

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
    SECONDARY_500,
    PRIMARY_600,
    SECONDARY_700,
    SECONDARY_800,
    SECONDARY_900,
    BLACK,
    GRAY_400,
  ],
  header: {
    ...defaultLightTheme.header,
    backgroundColor: PRIMARY_500,
    textColor: PRIMARY_950,
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
    textColor: WHITE,
    hoverTextColor: WHITE,
  },
  borderButton: {
    borderColor: PRIMARY_950,
    borderHoverColor: PRIMARY_900,
    textColor: PRIMARY_950,
    hoverTextColor: PRIMARY_900,
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
