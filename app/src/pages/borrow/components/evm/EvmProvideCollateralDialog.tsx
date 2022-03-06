import React from 'react';
import { bAsset, ERC20Addr } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useProvideCollateralTx } from 'tx/evm';
import { ProvideCollateralDialog } from '../ProvideCollateralDialog';
import { ProvideCollateralFormParams } from '../types';
import { useERC20Balance } from '@libs/app-provider/queries/erc20/balanceOf';

export const EvmProvideCollateralDialog = (
  props: DialogProps<ProvideCollateralFormParams>,
) => {
  const { token, tokenDisplay } = props;

  const { connected } = useAccount();

  const uTokenBalance = useERC20Balance<bAsset>(token as ERC20Addr);

  const [postTx, txResult] = useProvideCollateralTx();

  const proceed = useCallback(
    (amount: bAsset) => {
      if (connected && postTx) {
        postTx({
          collateralContract: token,
          amount,
          tokenDisplay,
        });
      }
    },
    [connected, postTx, token, tokenDisplay],
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
