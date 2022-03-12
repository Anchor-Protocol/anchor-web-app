import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from '@libs/neumorphism-ui/themes/muiThemeBase';

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

const BASE_BLUE_100 = 'rgba(37, 117, 164, 0.05)';
const BASE_BLUE_200 = '#5B5E80';
const BASE_BLUE_300 = '#3867c4';
const BASE_BLUE_400 = '#3e9bba';
const BASE_RED_100 = '#ef3158';
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

  intensity: 0.1,

  backgroundColor: BASE_GRAY_100,
  sectionBackgroundColor: BASE_GRAY_200,
  highlightBackgroundColor: WHITE,
  hoverBackgroundColor: BASE_BLUE_100,

  textColor: GRAY_700,
  dimTextColor: GRAY_500,

  colors: {
    positive: SECONDARY_500,
    negative: PRIMARY_500,
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
    backgroundColor: SECONDARY_500,
    textColor: WHITE,
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
    backgroundHoverColor: BASE_BLUE_200,
    textColor: WHITE,
    hoverTextColor: WHITE,
  },

  textButton: {
    textColor: BASE_GRAY_300,
  },

  borderButton: {
    borderColor: GRAY_700,
    borderHoverColor: BASE_BLUE_200,
    textColor: GRAY_700,
    hoverTextColor: BASE_BLUE_200,
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
