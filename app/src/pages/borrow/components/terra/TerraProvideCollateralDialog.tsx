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
  const { collateralToken, tokenDisplay } = props;

  const { connected, terraWalletAddress } = useAccount();

  const cw20Balance = useCW20Balance<bAsset>(
    collateralToken,
    terraWalletAddress,
  );

  const uTokenBalance = normalize(cw20Balance, 6, tokenDisplay?.decimals ?? 6);

  const [postTx, txResult] = useBorrowProvideCollateralTx(collateralToken);

  const proceed = useCallback(
    (depositAmount: bAsset) => {
      if (connected && postTx) {
        postTx({
          depositAmount,
          tokenDisplay,
        });
      }
    },
    [connected, postTx, tokenDisplay],
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
