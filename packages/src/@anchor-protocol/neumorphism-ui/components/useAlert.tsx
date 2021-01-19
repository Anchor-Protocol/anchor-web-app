import {
  DialogProps,
  DialogTemplate,
  OpenDialog,
  useDialog,
} from '@anchor-protocol/use-dialog';
import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactNode } from 'react';
import { DefaultTheme } from 'styled-components';
import { ActionButton } from './ActionButton';

export const useAlertStyles = makeStyles((theme: DefaultTheme) =>
  createStyles({
    paper: {
      backgroundColor: theme.backgroundColor,
      padding: 10,
    },
  }),
);

export function useAlert(): [OpenDialog<AlertParams, void>, ReactNode] {
  return useDialog(Template);
}

export interface AlertParams {
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
}

export const Template: DialogTemplate<AlertParams> = (props) => {
  return <Component {...props} />;
};

export function Component({
  closeDialog,
  title,
  description,
  agree = 'Agree',
}: DialogProps<AlertParams, void>) {
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
