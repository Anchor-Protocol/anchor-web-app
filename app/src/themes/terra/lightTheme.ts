import { muiThemeBase } from '@libs/neumorphism-ui/themes/muiThemeBase';
import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { themeBuilder, Mode } from '../themeHelper';
import { Chain } from '@anchor-protocol/app-provider';

const SECONDARY_200 = '#285e28';
const SECONDARY_300 = 'rgba(75, 219, 75, 0.1)';
const SECONDARY_400 = '#4BDB4B';
const SECONDARY_500 = '#36a337';
const SECONDARY_600 = '#2d832d';
const SECONDARY_700 = '#246d25';
const SECONDARY_800 = '#174f1a';
const SECONDARY_900 = '#0e3311';

const GRAY_100 = '#101010';

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
const BASE_GRAY_1100 = '#1c1c1c';

const BASE_BLUE_100 = 'rgba(37, 117, 164, 0.05)';
const BASE_BLUE_300 = '#3867c4';
const BASE_BLUE_400 = '#3e9bba';
const BASE_RED_100 = '#ef3158';
const BASE_RED_200 = '#e95979';
const BASE_GREEN_100 = '#94f3b8';
const BASE_ORANGE_100 = '#dd8f5c';
const BASE_YELLOW_100 = '#FF9A63';

const BLACK = '#000000';
const WHITE = '#FFFFFF';

export const lightTheme: DefaultTheme = {
  ...createMuiTheme({
    ...muiThemeBase,

    palette: {
      type: 'light',
    },
  }),

  ...themeBuilder(Chain.Terra, Mode.Light),

  intensity: 0.1,

  backgroundColor: BASE_GRAY_100,
  sectionBackgroundColor: BASE_GRAY_200,
  highlightBackgroundColor: WHITE,
  hoverBackgroundColor: BASE_BLUE_100,

  textColor: BASE_GRAY_300,
  dimTextColor: BASE_GRAY_600,

  colors: {
    positive: SECONDARY_400,
    negative: BASE_RED_200,
    warning: BASE_YELLOW_100,
    primary: SECONDARY_400,
    primaryDark: SECONDARY_400,
    secondary: SECONDARY_400,
    secondaryDark: SECONDARY_400,
  },

  //errorTextColor: BASE_RED_200,
  //positiveTextColor: SECONDARY_400,
  //pointColor: SECONDARY_400,

  chart: [
    SECONDARY_400,
    SECONDARY_500,
    SECONDARY_600,
    SECONDARY_700,
    SECONDARY_800,
    SECONDARY_900,
    GRAY_100,
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
