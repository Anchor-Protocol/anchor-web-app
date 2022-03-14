import { muiThemeBase } from '@libs/neumorphism-ui/themes/muiThemeBase';
import { createMuiTheme } from '@material-ui/core/styles';

// AVAX THEME TO FILL IN VARIABLE THEME
const PRIMARY_500 = '#F4A81A';
const PRIMARY_400 = '#F8B22F';
const SECONDARY_900 = '#661515';
const SECONDARY_800 = '#8B1010';
const SECONDARY_700 = '#A50C0C';
const SECONDARY_600 = '#D11516';
const SECONDARY_500 = '#E84142';
const SECONDARY_100 = '#FAD7D8';
const GRAY_700 = '#151515';
const GRAY_500 = '#A4A4A4';
const GRAY_400 = '#B7B7B7';

// DEFAULT THEME
export const BLACK = '#000000';
export const WHITE = '#FFFFFF';

export const BASE_GRAY_100 = '#EFEFEF';
export const BASE_GRAY_200 = '#F4F4F5';
export const BASE_GRAY_300 = '#1F1F1F';
export const BASE_GRAY_400 = '#E8E8E8';
export const BASE_GRAY_500 = '#2c2c2e';
export const BASE_GRAY_600 = '#999999';
export const BASE_GRAY_700 = '#2c2c2c';
export const BASE_GRAY_800 = 'rgba(0, 0, 0, 0.1)';
export const BASE_GRAY_900 = 'rgba(0, 0, 0, 0.15)';
export const BASE_GRAY_1000 = 'rgba(255, 255, 255, 0.8)';
export const BASE_GRAY_1100 = '#1c1c1c';

export const BASE_BLUE_100 = 'rgba(37, 117, 164, 0.05)';
export const BASE_BLUE_300 = '#3867c4';
export const BASE_BLUE_400 = '#3e9bba';
export const BASE_RED_100 = '#ef3158';
export const BASE_RED_200 = '#e95979';
export const BASE_GREEN_100 = '#94f3b8';
export const BASE_ORANGE_100 = '#dd8f5c';
export const BASE_YELLOW_100 = '#FF9A63';

export const defaultLightTheme = {
  ...createMuiTheme({
    ...muiThemeBase,
    palette: {
      type: 'light',
    },
  }),
  // VARIABLES (SHOULD BE CHANGED)
  textColor: GRAY_700,
  dimTextColor: GRAY_500,
  colors: {
    negative: BASE_RED_200,
    warning: BASE_YELLOW_100,
    positive: SECONDARY_500,
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
  // CONSTANTS (CAN BE DEFAULT)
  intensity: 0.1,
  backgroundColor: BASE_GRAY_100,
  sectionBackgroundColor: BASE_GRAY_200,
  highlightBackgroundColor: WHITE,
  hoverBackgroundColor: BASE_BLUE_100,
  label: {
    backgroundColor: WHITE,
    textColor: BASE_GRAY_300,
    borderColor: BASE_GRAY_400,
  },
  actionButton: {
    backgroundColor: BASE_GRAY_700,
    backgroundHoverColor: BASE_GRAY_1100,
    textColor: WHITE,
    hoverTextColor: WHITE,
  },
  textButton: {
    textColor: BASE_GRAY_300,
  },
  borderButton: {
    borderColor: BASE_GRAY_700,
    borderHoverColor: BASE_GRAY_1100,
    textColor: BASE_GRAY_300,
    hoverTextColor: BASE_GRAY_700,
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
      backgroundColor: BASE_GREEN_100,
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
