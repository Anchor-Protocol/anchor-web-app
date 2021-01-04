import {
  Snackbar,
  SnackbarControlRef,
  SnackbarProvider,
  useSnackbar,
} from '@anchor-protocol/snackbar';
import {
  IconButton,
  SnackbarContent as MuiSnackbarContent,
  SnackbarContentProps,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { ComponentType, useRef } from 'react';
import styled from 'styled-components';

let count: number = 0;

export default {
  title: 'core/Snackbar',
  decorators: [
    (Story: ComponentType) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
};

export const Basic = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <div>
      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar>
              <MuiSnackbarContent message={`${count} HELLO SNACKBAR!`} />
            </Snackbar>,
          );
        }}
      >
        Add a MUI Snackbar
      </button>

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

export const CustomElement = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <div>
      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar>
              <CustomElementSnackbar>
                {count} HELLO SNACKBAR!
              </CustomElementSnackbar>
            </Snackbar>,
          );
        }}
      >
        Add a Custom Snackbar
      </button>

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

export const Control = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  const controlRef = useRef<SnackbarControlRef>();

  return (
    <div>
      <button
        onClick={() => {
          controlRef.current?.close();

          count++;

          addSnackbar(
            <Snackbar controlRef={controlRef} autoClose={false}>
              <MuiSnackbarContent message={`${count} HELLO SNACKBAR!`} />
            </Snackbar>,
          );
        }}
      >
        Add a MUI Snackbar
      </button>

      <button
        onClick={() => {
          controlRef.current?.close();
        }}
      >
        Close Snackbar
      </button>

      <button
        onClick={() => {
          controlRef.current?.updateContent(
            <MuiSnackbarContent
              message={`CHANAGED CONTENT! ${Math.floor(Math.random() * 1000)}`}
            />,
          );
        }}
      >
        Update Snackbar content
      </button>

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

const CustomElementSnackbar = styled.div`
  display: inline-block;
  padding: 10px;
  border: 10px solid white;
  font-size: 16px;
  color: red;
`;

export const With_Action = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <div>
      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar>
              <ActionSnackbar message={`${count} HELLO SNACKBAR!`} />
            </Snackbar>,
          );
        }}
      >
        Add a Action Snackbar
      </button>

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

const ActionSnackbar = styled(
  ({ close, ...props }: SnackbarContentProps & { close?: () => void }) => {
    return (
      <MuiSnackbarContent
        {...props}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={close}
          >
            <Close />
          </IconButton>,
        ]}
      />
    );
  },
)``;

export const Prevent_Auto_Close = () => {
  const { addSnackbar, snackbarContainerRef } = useSnackbar();

  return (
    <div>
      <button
        onClick={() => {
          count++;

          addSnackbar(
            <Snackbar autoClose={false}>
              <ActionSnackbar message={`${count} HELLO SNACKBAR!`} />
            </Snackbar>,
          );
        }}
      >
        Add a Manual Close Snackbar
      </button>

      <SnackbarContainer ref={snackbarContainerRef} />
    </div>
  );
};

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
