import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { pressed } from '@libs/styled-neumorphism';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  title: ReactNode;
  source: string;
}

type FormReturn = void;

export function useCodeViewerDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
  title,
  source,
}: DialogProps<FormParams, FormReturn>) {
  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <h1>{title}</h1>
        <pre>{source}</pre>
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

  pre {
    max-height: 500px;
    overflow-y: auto;

    word-break: break-all;

    font-size: 12px;

    border-radius: 20px;
    padding: 20px;
    margin: -20px;

    ${({ theme }) =>
      pressed({
        color: theme.sectionBackgroundColor,
        distance: 1,
        intensity: theme.intensity,
      })}
  }
`;
