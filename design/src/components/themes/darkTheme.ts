import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  intensity: 0.45,

  backgroundColor: '#1a1d2e',
  textColor: '#ffffff',
  dimTextColor: 'rgba(255, 255, 255, 0.4)',

  actionButton: {
    backgroundColor: '#282d46',
    textColor: '#ffffff',
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
};