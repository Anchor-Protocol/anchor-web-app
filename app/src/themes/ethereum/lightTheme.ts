import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from '@libs/neumorphism-ui/themes/muiThemeBase';
import { themeBuilder, Mode } from '../themeHelper';
import { Chain } from '@anchor-protocol/app-provider';

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

const BLACK = '#000000';
const WHITE = '#FFFFFF';

const BASE_GRAY_100 = '#EFEFEF';
const BASE_GRAY_200 = '#F4F4F5';
const BASE_GRAY_300 = '#1F1F1F';
const BASE_GRAY_400 = '#E8E8E8';
const BASE_GRAY_500 = '#2c2c2e';
const BASE_GRAY_600 = '#999999';
const BASE_GRAY_700 = '#2c2c2c';
const BASE_GRAY_800 = 'rgba(0, 0, 0, 0.1)';
const BASE_GRAY_900 = 'rgba(0, 0, 0, 0.15)';
const BASE_GRAY_1000 = 'rgba(255, 255, 255, 0.8)';
// const BASE_GRAY_1100 = '#1c1c1c';

const BASE_BLUE_100 = 'rgba(37, 117, 164, 0.05)';
const BASE_BLUE_300 = '#3867c4';
const BASE_BLUE_400 = '#3e9bba';
const BASE_RED_100 = '#ef3158';
const BASE_RED_200 = '#e95979';
const BASE_GREEN_100 = '#94f3b8';
const BASE_ORANGE_100 = '#dd8f5c';
const BASE_YELLOW_100 = '#FF9A63';
/* eslint-enable */

export const lightTheme: DefaultTheme = {
  ...createMuiTheme({
    ...muiThemeBase,

    palette: {
      type: 'light',
    },
  }),

  ...themeBuilder(Chain.Ethereum, Mode.Light),

  intensity: 0.1,

  backgroundColor: BASE_GRAY_100,
  sectionBackgroundColor: BASE_GRAY_200,
  highlightBackgroundColor: WHITE,
  hoverBackgroundColor: BASE_BLUE_100,

  textColor: GRAY_700,
  dimTextColor: GRAY_500,

  colors: {
    positive: PRIMARY_500,
    negative: BASE_RED_200,
    warning: BASE_YELLOW_100,
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

  label: {
    backgroundColor: WHITE,
    textColor: BASE_GRAY_300,
    borderColor: BASE_GRAY_400,
  },

  actionButton: {
    backgroundColor: GRAY_700,
    backgroundHoverColor: GRAY_600,
    textColor: WHITE,
    hoverTextColor: WHITE,
  },

  textButton: {
    textColor: BASE_GRAY_300,
  },

  borderButton: {
    borderColor: GRAY_700,
    borderHoverColor: GRAY_600,
    textColor: GRAY_700,
    hoverTextColor: GRAY_600,
  },

  selector: {
    backgroundColor: BASE_GRAY_100,
    textColor: BASE_GRAY_500,
  },

  formControl: {
    labelColor: BASE_GRAY_600,
    labelFocusedColor: BASE_BLUE_300,
    labelErrorColor: BASE_RED_100,
  },

  textInput: {
    backgroundColor: BASE_GRAY_100,
    textColor: BASE_GRAY_700,
  },

  table: {
    head: {
      textColor: BASE_GRAY_600,
    },
    body: {
      textColor: BASE_GRAY_700,
    },
  },

  slider: {
    thumb: {
      shadowColor: BASE_GRAY_800,
      thumbColor: WHITE,
    },
  },

  skeleton: {
    backgroundColor: BASE_GRAY_900,
    lightColor: BASE_GRAY_1000,
  },

  dialog: {
    normal: {
      backgroundColor: BASE_GRAY_200,
      textColor: BASE_GRAY_300,
    },
    warning: {
      backgroundColor: BASE_GRAY_200,
      textColor: BASE_ORANGE_100,
    },
    error: {
      backgroundColor: BASE_GRAY_200,
      textColor: BASE_RED_100,
    },
    success: {
      backgroundColor: BASE_GRAY_200,
      textColor: BASE_BLUE_400,
    },
  },

  tooltip: {
    normal: {
      backgroundColor: PRIMARY_200,
      textColor: BASE_GRAY_300,
    },
    warning: {
      backgroundColor: BASE_ORANGE_100,
      textColor: WHITE,
    },
    error: {
      backgroundColor: BASE_RED_100,
      textColor: WHITE,
    },
    success: {
      backgroundColor: BASE_BLUE_400,
      textColor: WHITE,
    },
  },

  snackbar: {
    normal: {
      backgroundColor: BASE_GREEN_100,
      textColor: BASE_GRAY_300,
    },
    warning: {
      backgroundColor: BASE_ORANGE_100,
      textColor: BASE_GRAY_300,
    },
    error: {
      backgroundColor: BASE_RED_100,
      textColor: WHITE,
    },
    success: {
      backgroundColor: BASE_BLUE_400,
      textColor: WHITE,
    },
  },
};
