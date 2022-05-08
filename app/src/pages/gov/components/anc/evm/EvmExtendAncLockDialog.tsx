import React from 'react';
import { Second } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useExtendAncLockPeriodTx } from 'tx/evm';
import {
  ExtendAncLockDialog,
  ExtendAncLockDialogOuterProps,
} from '../ExtendAncLockDialog';
import { EvmTxResultRenderer } from 'components/tx/EvmTxResultRenderer';

export const EvmExtendAncLockDialog = (
  props: DialogProps<ExtendAncLockDialogOuterProps>,
) => {
  const { connected } = useAccount();

  const extendAncLockPeriodTx = useExtendAncLockPeriodTx();
  const { minimizable, minimize } = extendAncLockPeriodTx ?? {};
  const [postTx, txResult] = extendAncLockPeriodTx?.stream ?? [null, null];

  const proceed = useCallback(
    (period: Second) => {
      if (connected && postTx) {
        postTx({
          period,
        });
      }
    },
    [connected, postTx],
  );

  return (
    <ExtendAncLockDialog
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
