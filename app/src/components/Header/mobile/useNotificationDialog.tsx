import { Modal } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { NotificationContent } from '../notifications/NotificationContent';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useNotificationDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <NotificationContent />
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;
`;
