import type { Theme } from '@material-ui/core';

export const messageColors = ['normal', 'warning', 'error', 'success'] as const;

export type MessageColor = typeof messageColors[number];

export interface DialogTheme {
  backgroundColor: string;
  textColor: string;
}

export interface TooltipTheme {
  backgroundColor: string;
  textColor: string;
}

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
    backgroundHoverColor: string;
    textColor: string;
  };
  
  // selector
  selector: {
    backgroundColor: string;
    textColor: string;
  }

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

  // dialog
  dialog: Record<MessageColor, DialogTheme>;

  // tooltip
  tooltip: Record<MessageColor, TooltipTheme>;
}
