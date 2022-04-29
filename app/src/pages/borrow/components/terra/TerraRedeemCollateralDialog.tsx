import React from 'react';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance } from '@libs/app-provider';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { RedeemCollateralDialog } from '../RedeemCollateralDialog';
import { RedeemCollateralFormParams } from '../types';
import { normalize } from '@anchor-protocol/formatter';
import { useRedeemCollateralTx } from 'tx/terra';

export const TerraRedeemCollateralDialog = (
  props: DialogProps<RedeemCollateralFormParams>,
) => {
  const { collateral } = props;

  const { connected, terraWalletAddress } = useAccount();

  const cw20Balance = useCW20Balance<bAsset>(
    collateral.collateral_token,
    terraWalletAddress,
  );

  const uTokenBalance = normalize(cw20Balance, 6, collateral.decimals);

  const [postTx, txResult] = useRedeemCollateralTx(collateral);

  const proceed = useCallback(
    (redeemAmount: bAsset) => {
      if (connected && postTx) {
        postTx({ amount: redeemAmount });
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
