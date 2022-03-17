import React from 'react';
import { u, UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useBorrowBorrowTx } from '@anchor-protocol/app-provider';
import { BorrowDialog } from '../BorrowDialog';
import { BorrowFormParams } from '../types';

export const TerraBorrowDialog = (props: DialogProps<BorrowFormParams>) => {
  const { connected } = useAccount();

  const [postTx, txResult] = useBorrowBorrowTx();

  const proceed = useCallback(
    (borrowAmount: UST, txFee: u<UST>) => {
      if (connected && postTx) {
        postTx({ borrowAmount, txFee });
      }
    },
    [postTx, connected],
  );

  return (
    <BorrowDialog
      {...props}
      txResult={txResult}
      proceedable={postTx !== undefined}
      onProceed={proceed}
    />
  );
};
