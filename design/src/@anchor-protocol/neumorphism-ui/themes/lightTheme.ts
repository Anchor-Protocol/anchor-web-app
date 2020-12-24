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
  textColor: '#1f1f1f',
  dimTextColor: '#8a8a8a',

  actionButton: {
    backgroundColor: '#94f3b8',
    textColor: '#2c2c2e',
  },
  
  selector: {
    backgroundColor: '#f4f4f5',
    textColor: '#2c2c2e',
  },

  formControl: {
    labelColor: '#8a8a8a',
    labelFocusedColor: '#3867c4',
    labelErrorColor: '#ef3158',
  },

  textInput: {
    backgroundColor: '#efefef',
    textColor: '#2c2c2e',
  },

  table: {
    head: {
      textColor: '#8a8a8a',
    },
    body: {
      textColor: '#2c2c2e',
    },
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
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      textColor: '#ffffff',
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
};