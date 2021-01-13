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
import { ReactNode } from 'react';
import { ActionButton } from './ActionButton';

export function useAlert(): [OpenDialog<AlertParams, void>, ReactNode] {
  return useDialog(AlertDialogTemplate);
}

export interface AlertParams {
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
}

export const AlertDialogTemplate: DialogTemplate<AlertParams, void> = ({
  closeDialog,
  title,
  description,
  agree = 'Agree',
}) => {
  return (
    <Dialog
      open
      onClose={() => closeDialog()}
      disableBackdropClick
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
};
