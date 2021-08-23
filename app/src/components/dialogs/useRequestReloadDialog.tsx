import { Modal } from '@material-ui/core';
import { ActionButton } from '@libs/neumorphism-ui/components/ActionButton';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useRequestReloadDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({ className }: DialogProps<FormParams, FormReturn>) {
  return (
    <Modal open>
      <Dialog className={className}>
        <h1>Please Reload</h1>

        <p>
          User has been inactive for some time.
          <br />
          Please reload to continue using the Webapp.
        </p>

        <ActionButton
          className="proceed"
          onClick={() => window.location.reload()}
        >
          Reload
        </ActionButton>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;

  h1 {
    font-size: 27px;
    text-align: center;
    font-weight: 300;
    margin-bottom: 50px;
  }

  p {
  }

  .proceed {
    margin-top: 40px;
    width: 100%;
    height: 60px;
  }
`;
