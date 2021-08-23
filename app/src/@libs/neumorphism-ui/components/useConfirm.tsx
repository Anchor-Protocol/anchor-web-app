import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { ReactNode } from 'react';
import { ActionButton } from './ActionButton';
import { useAlertStyles } from './useAlert';

export function useConfirm(): [OpenDialog<ConfirmParams, boolean>, ReactNode] {
  return useDialog(Component as any);
}

export interface ConfirmParams {
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
  disagree?: string;
}

export function Component({
  closeDialog,
  title,
  description,
  agree = 'Agree',
  disagree = 'Disagree',
}: DialogProps<ConfirmParams, boolean>) {
  const classes = useAlertStyles();

  return (
    <Dialog
      open
      classes={classes}
      onClose={() => closeDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <ActionButton style={{ width: 150 }} onClick={() => closeDialog(false)}>
          {disagree}
        </ActionButton>
        <ActionButton
          autoFocus
          style={{ width: 150 }}
          onClick={() => closeDialog(true)}
        >
          {agree}
        </ActionButton>
      </DialogActions>
    </Dialog>
  );
}
