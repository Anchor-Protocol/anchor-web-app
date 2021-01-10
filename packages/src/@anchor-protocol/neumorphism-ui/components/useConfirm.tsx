import { ActionButton } from '@anchor-protocol/neumorphism-ui/components/ActionButton';
import {
  DialogTemplate,
  OpenDialog,
  useDialog,
} from '@anchor-protocol/use-dialog';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React, { ReactNode } from 'react';

export function useConfirm(): [OpenDialog<ConfirmParams, boolean>, ReactNode] {
  return useDialog(ConfirmDialogTemplate);
}

export interface ConfirmParams {
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
  disagree?: string;
}

export const ConfirmDialogTemplate: DialogTemplate<ConfirmParams, boolean> = ({
  closeDialog,
  title,
  description,
  agree = 'Agree',
  disagree = 'Disagree',
}) => {
  return (
    <Dialog
      open
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
};
