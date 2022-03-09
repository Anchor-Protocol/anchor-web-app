import React from 'react';
import { u, UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { BorrowDialog } from '../BorrowDialog';
import { BorrowFormParams } from '../types';
import { useBorrowUstTx } from 'tx/evm';
import { useEvmTerraAddressQuery } from 'queries';

export const EvmBorrowDialog = (props: DialogProps<BorrowFormParams>) => {
  const { connected, nativeWalletAddress } = useAccount();

  const { data: addr2 } = useEvmTerraAddressQuery(nativeWalletAddress);
  console.log('addr2', addr2);

  const borrowUstTx = useBorrowUstTx();
  const [postTx, txResult] = borrowUstTx?.stream ?? [null, null];

  const proceed = useCallback(
    (amount: UST, _txFee: u<UST>) => {
      if (connected && postTx) {
        postTx({ amount });
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
