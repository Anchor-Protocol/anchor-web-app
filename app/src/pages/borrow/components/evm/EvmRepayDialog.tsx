import React from 'react';
import { u, UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { RepayFormParams } from '../types';
import { useRepayUstTx } from 'tx/evm';
import { RepayDialog } from '../RepayDialog';

export const EvmRepayDialog = (props: DialogProps<RepayFormParams>) => {
  const { connected } = useAccount();

  const [postTx, txResult] = useRepayUstTx();

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
    />
  );
};
