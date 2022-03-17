import React from 'react';
import { useBorrowRedeemCollateralTx } from '@anchor-protocol/app-provider';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance } from '@libs/app-provider';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { RedeemCollateralDialog } from '../RedeemCollateralDialog';
import { RedeemCollateralFormParams } from '../types';
import { normalize } from '@anchor-protocol/formatter';

export const TerraRedeemCollateralDialog = (
  props: DialogProps<RedeemCollateralFormParams>,
) => {
  const { collateralToken, tokenDisplay } = props;

  const { connected, terraWalletAddress } = useAccount();

  const cw20Balance = useCW20Balance<bAsset>(
    collateralToken,
    terraWalletAddress,
  );

  const uTokenBalance = normalize(cw20Balance, 6, tokenDisplay?.decimals ?? 6);

  const [postTx, txResult] = useBorrowRedeemCollateralTx(collateralToken);

  const proceed = useCallback(
    (redeemAmount: bAsset) => {
      if (connected && postTx) {
        postTx({ redeemAmount, tokenDisplay });
      }
    },
    [connected, postTx, tokenDisplay],
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
