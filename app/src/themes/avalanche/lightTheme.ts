import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from '@libs/neumorphism-ui/themes/muiThemeBase';

/* eslint-disable */
const PRIMARY_1000 = '#130533';
const PRIMARY_900 = '#21085B';
const PRIMARY_800 = '#330D87';
const PRIMARY_700 = '#4111B1';
const PRIMARY_600 = '#4F13D7';
const PRIMARY_500 = '#5E17FE';
const PRIMARY_400 = '#7A40FF';
const PRIMARY_300 = '#9A6FFF';
const PRIMARY_200 = '#D2C0FF';
const PRIMARY_100 = '#F1EBFF';

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
/* eslint-enable */

export const lightTheme: DefaultTheme = {
  ...createMuiTheme({
    ...muiThemeBase,

    palette: {
      type: 'light',
    },
  }),

  intensity: 0.1,

  backgroundColor: '#efefef',
  sectionBackgroundColor: '#f4f4f5',
  highlightBackgroundColor: '#ffffff',
  hoverBackgroundColor: 'rgba(37, 117, 164, 0.05)',

  textColor: GRAY_700,
  dimTextColor: GRAY_500,

  colors: {
    positive: PRIMARY_500,
    negative: '#e95979',
    warning: '#ff9a63',
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
    backgroundColor: '#3E4060',
  },

  label: {
    backgroundColor: '#ffffff',
    textColor: '#1f1f1f',
    borderColor: '#e8e8e8',
  },

  actionButton: {
    backgroundColor: '#3E4060',
    backgroundHoverColor: '#5B5E80',
    textColor: '#ffffff',
    hoverTextColor: '#ffffff',
  },

  textButton: {
    textColor: '#1f1f1f',
  },

  borderButton: {
    borderColor: '#3E4060',
    borderHoverColor: '#5B5E80',
    textColor: '#3E4060',
    hoverTextColor: '#5B5E80',
  },

  selector: {
    backgroundColor: '#efefef',
    textColor: '#2c2c2e',
  },

  formControl: {
    labelColor: '#999999',
    labelFocusedColor: '#3867c4',
    labelErrorColor: '#ef3158',
  },

  textInput: {
    backgroundColor: '#efefef',
    textColor: '#2c2c2c',
  },

  table: {
    head: {
      textColor: '#999999',
    },
    body: {
      textColor: '#2c2c2c',
    },
  },

  slider: {
    thumb: {
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      thumbColor: '#ffffff',
    },
  },

  skeleton: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    lightColor: 'rgba(255, 255, 255, 0.8)',
  },

  dialog: {
    normal: {
      backgroundColor: '#f4f4f5',
      textColor: '#1f1f1f',
    },
    warning: {
      backgroundColor: '#f4f4f5',
      textColor: '#dd8f5c',
    },
    error: {
      backgroundColor: '#f4f4f5',
      textColor: '#ef3158',
    },
    success: {
      backgroundColor: '#f4f4f5',
      textColor: '#3e9bba',
    },
  },

  tooltip: {
    normal: {
      backgroundColor: PRIMARY_200,
      textColor: '#1f1f1f',
    },
    warning: {
      backgroundColor: '#dd8f5c',
      textColor: '#ffffff',
    },
    error: {
      backgroundColor: '#ef3158',
      textColor: '#ffffff',
    },
    success: {
      backgroundColor: '#3e9bba',
      textColor: '#ffffff',
    },
  },

  snackbar: {
    normal: {
      backgroundColor: '#94f3b8',
      textColor: '#1f1f1f',
    },
    warning: {
      backgroundColor: '#dd8f5c',
      textColor: '#1f1f1f',
    },
    error: {
      backgroundColor: '#ef3158',
      textColor: '#ffffff',
    },
    success: {
      backgroundColor: '#3e9bba',
      textColor: '#ffffff',
    },
  },
};
