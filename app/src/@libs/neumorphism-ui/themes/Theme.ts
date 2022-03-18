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

export interface SnackbarTheme {
  backgroundColor: string;
  textColor: string;
}

export interface NeumorphismTheme extends Theme {
  // neumorphism
  intensity: number;

  // colors
  backgroundColor: string;
  sectionBackgroundColor: string;
  highlightBackgroundColor: string;
  hoverBackgroundColor: string;

  textColor: string;
  dimTextColor: string;

  header: {
    backgroundColor: string;
    textColor: string;
  };

  // level
  colors: {
    positive: string;
    negative: string;
    warning: string;
    primary: string;
    primaryDark: string;
    secondary: string;
    secondaryDark: string;
  };

  // label
  label: {
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  };

  // the colors to display on the charts
  chart: string[];

  // action buttons
  actionButton: {
    backgroundColor: string;
    backgroundHoverColor: string;
    textColor: string;
    hoverTextColor: string;
  };

  // text buttons
  textButton: {
    textColor: string;
  };

  // border buttons
  borderButton: {
    borderColor: string;
    borderHoverColor: string;
    textColor: string;
    hoverTextColor: string;
  };

  // selector
  selector: {
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

  // slider
  slider: {
    thumb: {
      shadowColor: string;
      thumbColor: string;
    };
  };

  // skeleton
  skeleton: {
    backgroundColor: string;
    lightColor: string;
  };

  // message-box
  messageBox: {
    borderColor: string;
    backgroundColor: string;
    textColor: string;
    linkColor: string;
  };

  // dialog
  dialog: Record<MessageColor, DialogTheme>;

  // tooltip
  tooltip: Record<MessageColor, TooltipTheme>;

  // snackbar
  snackbar: Record<MessageColor, SnackbarTheme>;
}
