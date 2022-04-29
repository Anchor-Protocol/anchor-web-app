import React from 'react';
import { UST } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { RepayFormParams } from '../types';
import { RepayDialog } from '../RepayDialog';
import { useRepayUstTx } from 'tx/terra';

export const TerraRepayDialog = (props: DialogProps<RepayFormParams>) => {
  const { connected } = useAccount();

  const [postTx, txResult] = useRepayUstTx();

  const proceed = useCallback(
    (repayAmount: UST) => {
      if (connected && postTx) {
        postTx({ repayAmount });
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
