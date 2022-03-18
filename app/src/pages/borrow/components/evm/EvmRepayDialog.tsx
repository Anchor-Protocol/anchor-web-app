import React from 'react';
import { u, UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { RepayFormParams } from '../types';
import { useRepayUstTx } from 'tx/evm';
import { RepayDialog } from '../RepayDialog';
import { EvmTxResultRenderer } from 'components/tx/EvmTxResultRenderer';

export const EvmRepayDialog = (props: DialogProps<RepayFormParams>) => {
  const { connected } = useAccount();

  const repayUstTx = useRepayUstTx();
  const { isTxMinimizable } = repayUstTx?.utils ?? {};
  const [postTx, txResult] = repayUstTx?.stream ?? [null, null];

  const proceed = useCallback(
    (amount: UST, _txFee: u<UST>) => {
      if (connected && postTx) {
        postTx({ amount });
      }
    },
    [postTx, connected],
  );

  return (
    <RepayDialog
      {...props}
      txResult={txResult}
      proceedable={postTx !== undefined}
      onProceed={proceed}
      renderBroadcastTxResult={
        <EvmTxResultRenderer
          onExit={props.closeDialog}
          txStreamResult={txResult}
          minimizable={isTxMinimizable}
        />
      }
    />
  );
};
