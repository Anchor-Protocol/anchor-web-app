import { createMuiTheme } from '@material-ui/core/styles';
import { DefaultTheme } from 'styled-components';
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
};