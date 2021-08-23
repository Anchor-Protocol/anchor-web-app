import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import {
  ErrorSnackbarContent,
  NormalSnackbarContent,
  SnackbarContent,
  SuccessSnackbarContent,
  WarningSnackbarContent,
} from '@libs/neumorphism-ui/components/Snackbar';
import { Snackbar, SnackbarProvider, useSnackbar } from '@libs/snackbar';
import { Button, IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { ComponentType } from 'react';
import styled from 'styled-components';

export default {
  title: 'components/Snackbar',
  decorators: [
    (Story: ComponentType) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
};

let count: number = 0;

const autoClose = 1000 * 60;

export const Basic = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <Container>
      <ActionButton
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar autoClose={autoClose}>
              <SnackbarContent
                message={`${count} HELLO SNACKBAR!`}
                action={[
                  <Button key="undo" color="inherit" size="small">
                    UNDO
                  </Button>,
                  <IconButton key="close" aria-label="close" color="inherit">
                    <Close />
                  </IconButton>,
                ]}
              />
            </Snackbar>,
          );
        }}
      >
        Default
      </ActionButton>

      <ActionButton
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar autoClose={autoClose}>
              <NormalSnackbarContent
                message={`${count} HELLO SNACKBAR!`}
                action={[
                  <Button key="undo" color="inherit" size="small">
                    UNDO
                  </Button>,
                  <IconButton key="close" aria-label="close" color="inherit">
                    <Close />
                  </IconButton>,
                ]}
              />
            </Snackbar>,
          );
        }}
      >
        Normal
      </ActionButton>

      <ActionButton
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar autoClose={autoClose}>
              <SuccessSnackbarContent
                message={`${count} HELLO SNACKBAR!`}
                action={[
                  <Button key="undo" color="inherit" size="small">
                    UNDO
                  </Button>,
                  <IconButton key="close" aria-label="close" color="inherit">
                    <Close />
                  </IconButton>,
                ]}
              />
            </Snackbar>,
          );
        }}
      >
        Success
      </ActionButton>

      <ActionButton
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar autoClose={autoClose}>
              <WarningSnackbarContent
                message={`${count} HELLO SNACKBAR!`}
                action={[
                  <Button key="undo" color="inherit" size="small">
                    UNDO
                  </Button>,
                  <IconButton key="close" aria-label="close" color="inherit">
                    <Close />
                  </IconButton>,
                ]}
              />
            </Snackbar>,
          );
        }}
      >
        Warning
      </ActionButton>

      <ActionButton
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar autoClose={autoClose}>
              <ErrorSnackbarContent
                message={`${count} HELLO SNACKBAR!`}
                action={[
                  <Button key="undo" color="inherit" size="small">
                    UNDO
                  </Button>,
                  <IconButton key="close" aria-label="close" color="inherit">
                    <Close />
                  </IconButton>,
                ]}
              />
            </Snackbar>,
          );
        }}
      >
        Error
      </ActionButton>

      <SnackbarContainer ref={snackbarContainerRef} />
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 150px);
  gap: 10px;
`;

const SnackbarContainer = styled.div`
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
