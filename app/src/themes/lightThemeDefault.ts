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

// DEFAULT LIGHT THEME
export const BLACK = '#000000';
export const WHITE = '#FFFFFF';

export const LIGHT_GRAY_100 = '#EFEFEF';
export const LIGHT_GRAY_200 = '#F4F4F5';
export const LIGHT_GRAY_300 = '#1F1F1F';
export const LIGHT_GRAY_400 = '#E8E8E8';
export const LIGHT_GRAY_500 = '#2c2c2e';
export const LIGHT_GRAY_600 = '#999999';
export const LIGHT_GRAY_700 = '#2c2c2c';
export const LIGHT_GRAY_800 = 'rgba(0, 0, 0, 0.1)';
export const LIGHT_GRAY_900 = 'rgba(0, 0, 0, 0.15)';
export const LIGHT_GRAY_1000 = 'rgba(255, 255, 255, 0.8)';
export const LIGHT_GRAY_1100 = '#1c1c1c';

export const LIGHT_BLUE_100 = 'rgba(37, 117, 164, 0.05)';
export const LIGHT_BLUE_300 = '#3867c4';
export const LIGHT_BLUE_400 = '#3e9bba';

export const LIGHT_RED_100 = '#ef3158';
export const LIGHT_RED_200 = '#e95979';

export const LIGHT_GREEN_100 = '#94f3b8';
export const LIGHT_ORANGE_100 = '#dd8f5c';
export const LIGHT_YELLOW_100 = '#FF9A63';

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
    negative: LIGHT_RED_200,
    warning: LIGHT_YELLOW_100,
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
  backgroundColor: LIGHT_GRAY_100,
  sectionBackgroundColor: LIGHT_GRAY_200,
  highlightBackgroundColor: WHITE,
  hoverBackgroundColor: LIGHT_BLUE_100,
  label: {
    backgroundColor: WHITE,
    textColor: LIGHT_GRAY_300,
    borderColor: LIGHT_GRAY_400,
  },
  actionButton: {
    backgroundColor: LIGHT_GRAY_700,
    backgroundHoverColor: LIGHT_GRAY_1100,
    textColor: WHITE,
    hoverTextColor: WHITE,
  },
  textButton: {
    textColor: LIGHT_GRAY_300,
  },
  borderButton: {
    borderColor: LIGHT_GRAY_700,
    borderHoverColor: LIGHT_GRAY_1100,
    textColor: LIGHT_GRAY_300,
    hoverTextColor: LIGHT_GRAY_700,
  },
  selector: {
    backgroundColor: LIGHT_GRAY_100,
    textColor: LIGHT_GRAY_500,
  },
  formControl: {
    labelColor: LIGHT_GRAY_600,
    labelFocusedColor: LIGHT_BLUE_300,
    labelErrorColor: LIGHT_RED_100,
  },
  textInput: {
    backgroundColor: LIGHT_GRAY_100,
    textColor: LIGHT_GRAY_700,
  },
  table: {
    head: {
      textColor: LIGHT_GRAY_600,
    },
    body: {
      textColor: LIGHT_GRAY_700,
    },
  },
  slider: {
    thumb: {
      shadowColor: LIGHT_GRAY_800,
      thumbColor: WHITE,
    },
  },
  skeleton: {
    backgroundColor: LIGHT_GRAY_900,
    lightColor: LIGHT_GRAY_1000,
  },
  dialog: {
    normal: {
      backgroundColor: LIGHT_GRAY_200,
      textColor: LIGHT_GRAY_300,
    },
    warning: {
      backgroundColor: LIGHT_GRAY_200,
      textColor: LIGHT_ORANGE_100,
    },
    error: {
      backgroundColor: LIGHT_GRAY_200,
      textColor: LIGHT_RED_100,
    },
    success: {
      backgroundColor: LIGHT_GRAY_200,
      textColor: LIGHT_BLUE_400,
    },
  },
  tooltip: {
    normal: {
      backgroundColor: LIGHT_GREEN_100,
      textColor: LIGHT_GRAY_300,
    },
    warning: {
      backgroundColor: LIGHT_ORANGE_100,
      textColor: WHITE,
    },
    error: {
      backgroundColor: LIGHT_RED_100,
      textColor: WHITE,
    },
    success: {
      backgroundColor: LIGHT_BLUE_400,
      textColor: WHITE,
    },
  },
  snackbar: {
    normal: {
      backgroundColor: LIGHT_GREEN_100,
      textColor: LIGHT_GRAY_300,
    },
    warning: {
      backgroundColor: LIGHT_ORANGE_100,
      textColor: LIGHT_GRAY_300,
    },
    error: {
      backgroundColor: LIGHT_RED_100,
      textColor: WHITE,
    },
    success: {
      backgroundColor: LIGHT_BLUE_400,
      textColor: WHITE,
    },
  },
};
