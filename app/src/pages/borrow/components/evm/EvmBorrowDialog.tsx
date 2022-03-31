import React from 'react';
import { CollateralAmount, u, UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { BorrowDialog } from '../BorrowDialog';
import { BorrowFormParams } from '../types';
import { useBorrowUstTx } from 'tx/evm';
import { TxResultRenderer } from 'components/tx/TxResultRenderer';
import { useFormatters } from '@anchor-protocol/formatter';
import Big from 'big.js';
import { WhitelistCollateral } from 'queries';
import '@extensions/xanchor';

export const EvmBorrowDialog = (
  props: DialogProps<Omit<BorrowFormParams, 'input' | 'states'>>,
) => {
  const { connected } = useAccount();

  const { ust } = useFormatters();

  const borrowUstTx = useBorrowUstTx();
  const { isTxMinimizable, minimize } = borrowUstTx?.utils ?? {};
  const [postBorrowUstTx, borrowUstTxResult] = borrowUstTx?.stream ?? [
    null,
    null,
  ];

  const proceed = useCallback(
    (
      amount: UST,
      txFee: u<UST>,
      collateral?: WhitelistCollateral,
      collateralAmount?: u<CollateralAmount<Big>>,
    ) => {
      if (connected && postBorrowUstTx) {
        const borrowAmount = ust.microfy(ust.formatInput(amount));
        if (collateral && collateralAmount && collateralAmount.gt(0)) {
          postBorrowUstTx({
            borrowAmount,
            collateral,
            collateralAmount,
          });
          return;
        }

        postBorrowUstTx({ borrowAmount });
      }
    },
    [postBorrowUstTx, connected, ust],
  );

  return (
    <BorrowDialog
      {...props}
      txResult={borrowUstTxResult}
      proceedable={postBorrowUstTx !== undefined}
      onProceed={proceed}
      renderTxResult={({ txResult, closeDialog }) => (
        <TxResultRenderer
          onExit={closeDialog}
          resultRendering={txResult.value}
          minimizable={isTxMinimizable}
          onMinimize={minimize}
        />
      )}
    />
  );
};
