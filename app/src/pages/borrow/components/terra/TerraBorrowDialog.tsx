import React from 'react';
import { UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { BorrowDialog } from '../BorrowDialog';
import { BorrowFormParams } from '../types';
import { useBorrowUstTx } from 'tx/terra';

export const TerraBorrowDialog = (props: DialogProps<BorrowFormParams>) => {
  const { connected } = useAccount();

  const [postTx, txResult] = useBorrowUstTx();

  const proceed = useCallback(
    (borrowAmount: UST) => {
      if (connected && postTx) {
        postTx({ borrowAmount });
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
