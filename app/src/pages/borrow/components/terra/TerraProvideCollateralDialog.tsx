import React from 'react';
import { useBorrowProvideCollateralTx } from '@anchor-protocol/app-provider';
import { bAsset } from '@anchor-protocol/types';
import { useCW20Balance } from '@libs/app-provider';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { ProvideCollateralDialog } from '../ProvideCollateralDialog';
import { ProvideCollateralFormParams } from '../types';
import { normalize } from '@anchor-protocol/formatter';

export const TerraProvideCollateralDialog = (
  props: DialogProps<ProvideCollateralFormParams>,
) => {
  const { collateral } = props;

  const { connected, terraWalletAddress } = useAccount();

  const cw20Balance = useCW20Balance<bAsset>(
    collateral.collateral_token,
    terraWalletAddress,
  );

  const uTokenBalance = normalize(cw20Balance, 6, collateral.decimals);

  const [postTx, txResult] = useBorrowProvideCollateralTx(collateral);

  const proceed = useCallback(
    (depositAmount: bAsset) => {
      if (connected && postTx) {
        postTx({
          depositAmount,
        });
      }
    },
    [connected, postTx],
  );

  return (
    <ProvideCollateralDialog
      {...props}
      txResult={txResult}
      uTokenBalance={uTokenBalance}
      proceedable={postTx !== undefined}
      onProceed={proceed}
    />
  );
};
