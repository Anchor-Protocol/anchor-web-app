import React from 'react';
import { bAsset, NoMicro, u } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useProvideCollateralTx } from 'tx/evm';
import { ProvideCollateralDialog } from '../ProvideCollateralDialog';
import { ProvideCollateralFormParams } from '../types';
import { useERC20Balance } from '@libs/app-provider/queries/erc20/balanceOf';
import { normalize } from '@anchor-protocol/formatter';
import { useERC20Decimals } from '@libs/app-provider/queries/erc20/decimals';
import { EvmTxResultRenderer } from 'components/tx/EvmTxResultRenderer';

export const EvmProvideCollateralDialog = (
  props: DialogProps<ProvideCollateralFormParams>,
) => {
  const { collateral } = props;

  const { connected } = useAccount();

  const erc20TokenBalance = useERC20Balance<bAsset>(collateral.bridgedAddress);

  const erc20Decimals = useERC20Decimals(collateral.bridgedAddress);

  const uTokenBalance = erc20Decimals
    ? normalize(erc20TokenBalance, erc20Decimals, collateral.decimals)
    : ('0' as u<bAsset>);

  const provideCollateralTx = useProvideCollateralTx();
  const { isTxMinimizable, minimize } = provideCollateralTx?.utils ?? {};
  const [postTx, txResult] = provideCollateralTx?.stream ?? [null, null];

  const proceed = useCallback(
    (amount: bAsset & NoMicro) => {
      if (connected && postTx && erc20Decimals) {
        postTx({
          collateral,
          amount,
          erc20Decimals,
        });
      }
    },
    [connected, postTx, collateral, erc20Decimals],
  );

  return (
    <ProvideCollateralDialog
      {...props}
      txResult={txResult}
      uTokenBalance={uTokenBalance}
      proceedable={postTx !== undefined && erc20Decimals !== undefined}
      onProceed={proceed}
      renderBroadcastTxResult={
        <EvmTxResultRenderer
          onExit={props.closeDialog}
          txStreamResult={txResult}
          minimizable={isTxMinimizable}
          onMinimize={minimize}
        />
      }
    />
  );
};
