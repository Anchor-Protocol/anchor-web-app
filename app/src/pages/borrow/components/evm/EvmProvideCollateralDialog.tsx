import React from 'react';
import { bAsset, ERC20Addr, NoMicro } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useProvideCollateralTx } from 'tx/evm';
import { ProvideCollateralDialog } from '../ProvideCollateralDialog';
import { ProvideCollateralFormParams } from '../types';
import { useERC20Balance } from '@libs/app-provider/queries/erc20/balanceOf';
import { normalize } from '@anchor-protocol/formatter';

export const EvmProvideCollateralDialog = (
  props: DialogProps<ProvideCollateralFormParams>,
) => {
  const { token, tokenDisplay } = props;

  const { connected } = useAccount();

  const erc20TokenBalance = useERC20Balance<bAsset>(token as ERC20Addr);

  // TODO: where do we get this from?
  const erc20Decimals = tokenDisplay?.symbol === 'bLuna' ? 6 : 18;

  const uTokenBalance = normalize(
    erc20TokenBalance,
    erc20Decimals,
    tokenDisplay?.decimals ?? 6,
  );

  const provideCollateralTx = useProvideCollateralTx(erc20Decimals);

  const [postTx, txResult] = provideCollateralTx?.stream ?? [null, null];

  const proceed = useCallback(
    (amount: bAsset & NoMicro) => {
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
