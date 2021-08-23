import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import { NeumorphismTheme } from '../themes/Theme';
import { ActionButton } from './ActionButton';

export const useAlertStyles = makeStyles((theme: NeumorphismTheme) =>
  createStyles({
    paper: {
      backgroundColor: theme.backgroundColor,
      padding: 10,
    },
  }),
);

type FormReturn = void;

export interface AlertParams {
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
}

export function useAlert(): [OpenDialog<AlertParams, boolean>, ReactNode] {
  return useDialog(Component as any);
}

export function Component({
  closeDialog,
  title,
  description,
  agree = 'Agree',
}: DialogProps<AlertParams, FormReturn>) {
  const classes = useAlertStyles();

  return (
    <Dialog
      open
      classes={classes}
      onClose={() => closeDialog()}
      disableBackdropClick
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 100 }}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <ActionButton
          autoFocus
          style={{ width: '100%' }}
          onClick={() => closeDialog()}
        >
          {agree}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}
