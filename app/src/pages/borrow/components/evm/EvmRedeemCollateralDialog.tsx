import React from 'react';
import { bAsset, ERC20Addr, u } from '@anchor-protocol/types';
import type { DialogProps } from '@libs/use-dialog';
import { useAccount } from 'contexts/account';
import { useCallback } from 'react';
import { useRedeemCollateralTx } from 'tx/evm';
import { RedeemCollateralDialog } from '../RedeemCollateralDialog';
import { RedeemCollateralFormParams } from '../types';
import { useERC20Balance } from '@libs/app-provider/queries/erc20/balanceOf';
import { normalize } from '@anchor-protocol/formatter';
import { useERC20Decimals } from '@libs/app-provider/queries/erc20/decimals';
import { EvmTxResultRenderer } from 'components/tx/EvmTxResultRenderer';

export const EvmRedeemCollateralDialog = (
  props: DialogProps<RedeemCollateralFormParams>,
) => {
  const { collateral } = props;

  const { connected } = useAccount();

  const erc20TokenBalance = useERC20Balance<bAsset>(
    collateral.bridgedAddress as ERC20Addr,
  );

  const erc20Decimals = useERC20Decimals(collateral.bridgedAddress);

  const uTokenBalance = erc20Decimals
    ? normalize(erc20TokenBalance, erc20Decimals, collateral.decimals)
    : ('0' as u<bAsset>);

  const redeemCollateralTx = useRedeemCollateralTx();

  const { isTxMinimizable, minimize } = redeemCollateralTx?.utils ?? {};
  const [postTx, txResult] = redeemCollateralTx?.stream ?? [null, null];

  const proceed = useCallback(
    (amount: bAsset) => {
      if (connected && postTx) {
        postTx({
          collateral,
          amount,
        });
      }
    },
    [connected, postTx, collateral],
  );

  return (
    <RedeemCollateralDialog
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
