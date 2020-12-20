import type { Theme } from '@material-ui/core';

export interface NeumorphismTheme extends Theme {
  // neumorphism
  intensity: number;

  // colors
  backgroundColor: string;
  textColor: string;
  dimTextColor: string;

  // action buttons
  actionButton: {
    backgroundColor: string;
    textColor: string;
  };

  // form control
  formControl: {
    labelColor: string;
    labelFocusedColor: string;
    labelErrorColor: string;
  };

  // text input
  textInput: {
    backgroundColor: string;
    textColor: string;
  };

  // table
  table: {
    head: {
      textColor: string;
    };

    body: {
      textColor: string;
    };
  };
}
