import React from 'react';
import { ANC } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import {
  WithdrawAncDialog,
  WithdrawAncDialogOuterProps,
} from '../WithdrawAncDialog';
import { useWithdrawAncTx } from 'tx/evm';
import { EvmTxResultRenderer } from 'components/tx/EvmTxResultRenderer';

export const EvmWithdrawAncDialog = (
  props: DialogProps<WithdrawAncDialogOuterProps>,
) => {
  const { connected } = useAccount();

  const withdrawAncTx = useWithdrawAncTx();
  const { minimizable, minimize } = withdrawAncTx ?? {};
  const [postTx, txResult] = withdrawAncTx?.stream ?? [null, null];

  const proceed = useCallback(
    (amount: ANC<string>) => {
      if (connected && postTx) {
        postTx({
          amount: amount.toString(),
        });
      }
    },
    [connected, postTx],
  );

  return (
    <WithdrawAncDialog
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
