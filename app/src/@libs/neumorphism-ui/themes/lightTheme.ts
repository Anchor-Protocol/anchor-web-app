import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from './muiThemeBase';

export const lightTheme: DefaultTheme = {
  ...createMuiTheme({
    ...muiThemeBase,

    palette: {
      type: 'light',
    },
  }),

  intensity: 0.1,

  backgroundColor: '#f4f4f5',
  highlightBackgroundColor: '#ffffff',
  hoverBackgroundColor: 'rgba(37, 117, 164, 0.05)',

  textColor: '#1f1f1f',
  dimTextColor: '#999999',

  colors: {
    positive: '#4BDB4B',
    negative: '#e95979',
    warning: '#ff9a63',
  },

  //errorTextColor: '#e95979',
  //positiveTextColor: '#4BDB4B',
  //
  //pointColor: '#4BDB4B',

  label: {
    backgroundColor: '#ffffff',
    textColor: '#1f1f1f',
    borderColor: '#e8e8e8',
  },

  actionButton: {
    backgroundColor: '#2c2c2c',
    backgroundHoverColor: '#1c1c1c',
    textColor: '#ffffff',
  },

  textButton: {
    textColor: '#1f1f1f',
  },

  borderButton: {
    borderColor: '#2c2c2c',
    borderHoverColor: '#1c1c1c',
    textColor: '#1f1f1f',
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
      backgroundColor: '#94f3b8',
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
