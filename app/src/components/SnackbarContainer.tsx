import { useSnackbar } from '@libs/snackbar';
import React from 'react';
import styled from 'styled-components';

export interface SnackbarContainerProps {
  className?: string;
}

function SnackbarContainerBase({ className }: SnackbarContainerProps) {
  const { snackbarContainerRef } = useSnackbar();
  return <div ref={snackbarContainerRef} className={className} />;
}

export const SnackbarContainer = styled(SnackbarContainerBase)`
  position: fixed;
  right: 10px;
  bottom: 10px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: right;
  align-items: flex-end;

  > * {
    margin-top: 10px;
  }
`;
