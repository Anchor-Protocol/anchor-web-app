import { Modal } from '@material-ui/core';
import { ActionButton } from '@terra-dev/neumorphism-ui/components/ActionButton';
import { Dialog } from '@terra-dev/neumorphism-ui/components/Dialog';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { AnnouncementTargetUser } from '../data/type';
import { BurnUserAnnouncementContent } from './BurnUserAnnouncementContent';
import { MintUserAnnouncementContent } from './MintUserAnnouncementContent';

interface FormParams {
  className?: string;
  burnUser?: AnnouncementTargetUser | null;
  mintUser?: AnnouncementTargetUser | null;
  onHide: () => void;
}

type FormReturn = void;

export function useAnnouncementDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
  burnUser,
  mintUser,
  onHide,
}: DialogProps<FormParams, FormReturn>) {
  return (
    <Modal open disableBackdropClick>
      <Dialog className={className} onClose={() => closeDialog()}>
        <article>
          {burnUser && <BurnUserAnnouncementContent {...burnUser} />}
          {mintUser && <MintUserAnnouncementContent {...mintUser} />}
        </article>
        <footer>
          <ActionButton onClick={() => closeDialog()}>Close</ActionButton>
          <ActionButton
            onClick={() => {
              onHide();
              closeDialog();
            }}
          >
            Hide 8 hours
          </ActionButton>
        </footer>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  article {
  }

  footer {
    margin-top: 30px;

    display: flex;
    flex-direction: column;

    > button {
      width: 100%;

      &:not(:first-child) {
        margin-top: 15px;
      }
    }
  }
`;
