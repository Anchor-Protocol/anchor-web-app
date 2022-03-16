import React from 'react';
import { useBorrowRedeemCollateralTx } from '@anchor-protocol/app-provider';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance } from '@libs/app-provider';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { RedeemCollateralDialog } from '../RedeemCollateralDialog';
import { RedeemCollateralFormParams } from '../types';

export const TerraRedeemCollateralDialog = (
  props: DialogProps<RedeemCollateralFormParams>,
) => {
  const { collateralToken } = props;

  const { connected, terraWalletAddress } = useAccount();

  const uTokenBalance = useCW20Balance<bAsset>(
    collateralToken,
    terraWalletAddress,
  );

  const [postTx, txResult] = useBorrowRedeemCollateralTx(collateralToken);

  const proceed = useCallback(
    (redeemAmount: bAsset) => {
      if (connected && postTx) {
        postTx({ redeemAmount });
      }
    },
    [connected, postTx],
  );

  return (
    <RedeemCollateralDialog
      {...props}
      txResult={txResult}
      uTokenBalance={uTokenBalance}
      proceedable={postTx !== undefined}
      onProceed={proceed}
    />
  );
};
