import React from 'react';
import { ANC, Second } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { LockAncDialog, LockAncDialogOuterProps } from '../LockAncDialog';
import { useLockAncTx } from 'tx/terra';

export const TerraLockAncDialog = (
  props: DialogProps<LockAncDialogOuterProps>,
) => {
  const { connected } = useAccount();

  const [postTx, txResult] = useLockAncTx();

  const proceed = useCallback(
    (amount: ANC<number>, period?: Second) => {
      if (connected && postTx) {
        postTx({
          amount,
          period,
        });
      }
    },
    [connected, postTx],
  );

  return <LockAncDialog {...props} txResult={txResult} onProceed={proceed} />;
};
