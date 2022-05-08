import React from 'react';
import { Second } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useExtendAncLockPeriodTx } from 'tx/terra';
import {
  ExtendAncLockDialog,
  ExtendAncLockDialogOuterProps,
} from '../ExtendAncLockDialog';

export const TerraExtendAncLockDialog = (
  props: DialogProps<ExtendAncLockDialogOuterProps>,
) => {
  const { connected } = useAccount();

  const [postTx, txResult] = useExtendAncLockPeriodTx();

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
    <ExtendAncLockDialog {...props} txResult={txResult} onProceed={proceed} />
  );
};
