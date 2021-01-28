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

  backgroundColor: '#1f2237',
  textColor: '#ffffff',
  dimTextColor: 'rgba(255, 255, 255, 0.5)',
  errorTextColor: '#ac2b45',
  highlightBackgroundColor: '#363c5f',
  
  label: {
    backgroundColor: '#363c5f',
    textColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },

  actionButton: {
    backgroundColor: '#363c5f',
    backgroundHoverColor: '#404872',
    textColor: '#ffffff',
  },
  
  selector: {
    backgroundColor: '#1b1e31',
    textColor: '#ffffff',
  },

  formControl: {
    labelColor: 'rgba(255, 255, 255, 0.5)',
    labelFocusedColor: '#3867c4',
    labelErrorColor: '#ac2b45',
  },

  textInput: {
    backgroundColor: '#1b1e31',
    textColor: '#ffffff',
  },

  table: {
    head: {
      textColor: 'rgba(255, 255, 255, 0.5)',
    },
    body: {
      textColor: '#ffffff',
    },
  },
  
  slider: {
    thumb: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      thumbColor: '#ffffff',
    },
  },
  
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    lightColor: 'rgba(255, 255, 255, 0.2)'
  },

  dialog: {
    normal: {
      backgroundColor: '#1f2237',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: '#1f2237',
      textColor: '#d69f34',
    },
    error: {
      backgroundColor: '#1f2237',
      textColor: '#ac2b45',
    },
    success: {
      backgroundColor: '#1f2237',
      textColor: '#3e9bba',
    },
  },
  
  tooltip: {
    normal: {
      backgroundColor: '#363d5e',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: '#d69f34',
      textColor: '#ffffff',
    },
    error: {
      backgroundColor: '#ac2b45',
      textColor: '#ffffff',
    },
    success: {
      backgroundColor: '#3e9bba',
      textColor: '#ffffff',
    },
  },
  
  snackbar: {
    normal: {
      backgroundColor: '#363d5e',
      textColor: '#ffffff',
    },
    warning: {
      backgroundColor: '#d69f34',
      textColor: '#ffffff',
    },
    error: {
      backgroundColor: '#ac2b45',
      textColor: '#ffffff',
    },
    success: {
      backgroundColor: '#3e9bba',
      textColor: '#ffffff',
    },
  },
};
