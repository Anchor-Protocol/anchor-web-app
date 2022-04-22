import { BorderButton } from '@libs/neumorphism-ui/components/BorderButton';
import { CW20Addr } from '@libs/types';
import { useDialog } from '@libs/use-dialog';
import React from 'react';
import {
  CollateralVoteDialog,
  CollateralVoteDialogParams,
} from './CollateralVoteDialog';

interface VoteProps {
  tokenAddress: CW20Addr;
  disabled: boolean;
}

export const Vote = ({ tokenAddress, disabled }: VoteProps) => {
  const [openCollateralVoteDialog, collateralVoteDialogElement] =
    useDialog<CollateralVoteDialogParams>(CollateralVoteDialog);

  return (
    <>
      <BorderButton
        onClick={() => openCollateralVoteDialog({ tokenAddress })}
        disabled={disabled}
      >
        Vote
      </BorderButton>
      {collateralVoteDialogElement}
    </>
  );
};
