import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from './muiThemeBase';

export const darkTheme: DefaultTheme = {
  ...createMuiTheme({
    ...muiThemeBase,

    palette: {
      type: 'dark',
    },

    overrides: {
      MuiTouchRipple: {
        root: {
          opacity: 0.15,
        },
      },
    },
  }),

  intensity: 0.45,

  backgroundColor: '#1a1d2e',
  textColor: '#ffffff',
  dimTextColor: 'rgba(255, 255, 255, 0.4)',

  actionButton: {
    backgroundColor: '#282d46',
    textColor: '#ffffff',
  },

  formControl: {
    labelColor: 'rgba(255, 255, 255, 0.4)',
    labelFocusedColor: '#3867c4',
    labelErrorColor: '#ac2b45',
  },

  textInput: {
    backgroundColor: '#181b2b',
    textColor: '#ffffff',
  },

  table: {
    head: {
      textColor: 'rgba(255, 255, 255, 0.4)',
    },
    body: {
      textColor: '#ffffff',
    },
  },

  dialog: {
    backgroundColor: '#1a1d2e',
    textColor: '#ffffff',
  },
};
