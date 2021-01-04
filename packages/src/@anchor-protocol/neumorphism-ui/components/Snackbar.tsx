import { SnackbarContent as MuiSnackbarContent, SnackbarContentProps } from '@material-ui/core';
import { ComponentType } from 'react';
import styled from 'styled-components';

export const SnackbarContent: ComponentType<SnackbarContentProps> = styled(MuiSnackbarContent)`
  && {
    border-radius: 0;
    background-color: var(--snackbar-background-color);
    color: var(--snackbar-label-color);

    .MuiButton-label,
    .MuiIconButton-label {
      opacity: 0.6;
    }
  }
`;

export const NormalSnackbarContent: ComponentType<SnackbarContentProps> = styled(SnackbarContent)`
  --snackbar-background-color: rgba(255, 255, 255, 0.6);
  --snackbar-label-color: #030a18;
`;

export const InfoSnackbarContent: ComponentType<SnackbarContentProps> = styled(SnackbarContent)`
  --snackbar-background-color: #00a4c8;
  --snackbar-label-color: #ffffff;
`;

export const WarningSnackbarContent: ComponentType<SnackbarContentProps> = styled(SnackbarContent)`
  --snackbar-background-color: #d6ae41;
  --snackbar-label-color: #ffffff;
`;

export const ErrorSnackbarContent: ComponentType<SnackbarContentProps> = styled(SnackbarContent)`
  --snackbar-background-color: #c9434b;
  --snackbar-label-color: #ffffff;
`;
