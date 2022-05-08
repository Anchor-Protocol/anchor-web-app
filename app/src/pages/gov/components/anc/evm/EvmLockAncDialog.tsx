import React from 'react';
import { ANC, Second } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { LockAncDialog, LockAncDialogOuterProps } from '../LockAncDialog';
import { useLockAncTx } from 'tx/evm';
import { EvmTxResultRenderer } from 'components/tx/EvmTxResultRenderer';

export const EvmLockAncDialog = (
  props: DialogProps<LockAncDialogOuterProps>,
) => {
  const { connected } = useAccount();

  const lockAncTx = useLockAncTx();
  const { minimizable, minimize } = lockAncTx ?? {};
  const [postTx, txResult] = lockAncTx?.stream ?? [null, null];

  const proceed = useCallback(
    (amount: ANC<number>, period?: Second) => {
      if (connected && postTx) {
        postTx({
          amount: amount.toString(),
          period,
        });
      }
    },
    [connected, postTx],
  );

  return (
    <LockAncDialog
      {...props}
      txResult={txResult}
      onProceed={proceed}
      renderBroadcastTxResult={
        <EvmTxResultRenderer
          onExit={props.closeDialog}
          txStreamResult={txResult}
          minimizable={minimizable}
          onMinimize={minimize}
        />
      }
    />
  );
};
