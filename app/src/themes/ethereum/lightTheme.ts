import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from '@libs/neumorphism-ui/themes/muiThemeBase';

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
    textColor: PRIMARY_500,
  },

  messageBox: {
    borderColor: SECONDARY_500,
    backgroundColor: SECONDARY_100,
    textColor: SECONDARY_900,
    linkColor: SECONDARY_500,
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
