import {
  SnackbarContent as MuiSnackbarContent,
  SnackbarContentProps as MuiSnackbarContentProps,
} from '@material-ui/core';
import styled from 'styled-components';

export interface SnackbarContentProps extends MuiSnackbarContentProps {
  close?: () => void;
}

function SnackbarContentBase({
  close,
  ...snackbarContentProps
}: SnackbarContentProps) {
  return <MuiSnackbarContent {...snackbarContentProps} />;
}

export const SnackbarContent = styled(SnackbarContentBase)`
  // TODO
`;
