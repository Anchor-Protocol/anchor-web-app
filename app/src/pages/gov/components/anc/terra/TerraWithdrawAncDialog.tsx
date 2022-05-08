import React from 'react';
import { ANC } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useWithdrawAncTx } from 'tx/terra';
import {
  WithdrawAncDialog,
  WithdrawAncDialogOuterProps,
} from '../WithdrawAncDialog';

export const TerraWithdrawAncDialog = (
  props: DialogProps<WithdrawAncDialogOuterProps>,
) => {
  const { connected } = useAccount();

  const [postTx, txResult] = useWithdrawAncTx();

  const proceed = useCallback(
    (amount: ANC<string>) => {
      if (connected && postTx) {
        postTx({
          amount,
        });
      }
    },
    [connected, postTx],
  );

  return (
    <WithdrawAncDialog {...props} txResult={txResult} onProceed={proceed} />
  );
};
