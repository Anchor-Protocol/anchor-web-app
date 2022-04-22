import { CW20Addr } from '@libs/types';
import { DialogProps } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { Dialog } from '@libs/neumorphism-ui/components/Dialog';
import React from 'react';

export interface CollateralVoteDialogParams {
  tokenAddress: CW20Addr;
}

type CollateralVoteDialogProps = DialogProps<CollateralVoteDialogParams>;

export const CollateralVoteDialog = ({
  tokenAddress,
  closeDialog,
}: CollateralVoteDialogProps) => {
  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog onClose={() => closeDialog()}>
        <h1>Vote for gauge</h1>
        <p>{tokenAddress}</p>
      </Dialog>
    </Modal>
  );
};
