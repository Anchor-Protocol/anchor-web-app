import React from 'react';
import { CollateralAmount, CW20Addr, u, UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { BorrowDialog } from '../BorrowDialog';
import { BorrowFormParams } from '../types';
import { useBorrowUstTx } from 'tx/evm';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';

export const EvmBorrowDialog = (props: DialogProps<BorrowFormParams>) => {
  const { connected } = useAccount();

  const borrowUstTx = useBorrowUstTx();
  const { isTxMinimizable } = borrowUstTx?.utils ?? {};
  const [postBorrowUstTx, borrowUstTxResult] = borrowUstTx?.stream ?? [
    null,
    null,
  ];

  //const provideAndBorrowTx = useProvideAndBorrowTx();

  const proceed = useCallback(
    (
      amount: UST,
      _txFee: u<UST>,
      collateral?: CW20Addr,
      collateralAmount?: CollateralAmount,
    ) => {
      if (connected && postBorrowUstTx) {
        postBorrowUstTx({ amount });
      }
    },
    [postBorrowUstTx, connected],
  );

  return (
    <BorrowDialog
      {...props}
      txResult={borrowUstTxResult}
      proceedable={postBorrowUstTx !== undefined}
      onProceed={proceed}
      renderBroadcastTxResult={({ txResult, closeDialog }) => (
        <TxResultRenderer
          onExit={closeDialog}
          resultRendering={txResult.value}
          minimizable={isTxMinimizable}
        />
      )}
    />
  );
};
