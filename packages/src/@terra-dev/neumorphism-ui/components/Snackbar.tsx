import {
  SnackbarContent as MuiSnackbarContent,
  SnackbarContentProps,
} from '@material-ui/core';
import { ComponentType } from 'react';
import styled from 'styled-components';

export const SnackbarContent: ComponentType<SnackbarContentProps> = styled(
  MuiSnackbarContent,
)`
  && {
    border-radius: 5px;

    .MuiButton-label,
    .MuiIconButton-label {
      opacity: 0.6;
    }
  }
`;

export const NormalSnackbarContent: ComponentType<SnackbarContentProps> = styled(
  SnackbarContent,
)`
  && {
    background-color: ${({ theme }) => theme.snackbar.normal.backgroundColor};
    color: ${({ theme }) => theme.snackbar.normal.textColor};
  }
`;

export const SuccessSnackbarContent: ComponentType<SnackbarContentProps> = styled(
  SnackbarContent,
)`
  && {
    background-color: ${({ theme }) => theme.snackbar.success.backgroundColor};
    color: ${({ theme }) => theme.snackbar.success.textColor};
  }
`;

export const WarningSnackbarContent: ComponentType<SnackbarContentProps> = styled(
  SnackbarContent,
)`
  && {
    background-color: ${({ theme }) => theme.snackbar.warning.backgroundColor};
    color: ${({ theme }) => theme.snackbar.warning.textColor};
  }
`;

export const ErrorSnackbarContent: ComponentType<SnackbarContentProps> = styled(
  SnackbarContent,
)`
  && {
    background-color: ${({ theme }) => theme.snackbar.error.backgroundColor};
    color: ${({ theme }) => theme.snackbar.error.textColor};
  }
`;
