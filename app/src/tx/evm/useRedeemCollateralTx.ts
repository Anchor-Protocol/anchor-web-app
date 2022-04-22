import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { TxKind } from './utils';
import { Subject } from 'rxjs';
import { useCallback, useRef } from 'react';
import { CrossChainEventHandler } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { formatOutput, microfy } from '@anchor-protocol/formatter';
import { bAsset, NoMicro } from '@anchor-protocol/types';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { WhitelistCollateral } from 'queries';

export interface RedeemCollateralTxParams {
  collateral: WhitelistCollateral;
  amount: bAsset & NoMicro;
}

export function useRedeemCollateralTx():
  | BackgroundTxResult<RedeemCollateralTxParams>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const redeemTx = useCallback(
    async (
      txParams: RedeemCollateralTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const {
        collateral: { collateral_token, symbol, decimals },
        amount,
      } = txParams;

      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.withdrawCollateral(symbol);
      writer.timer.start();

      try {
        const result = await xAnchor.unlockCollateral(
          { contract: collateral_token },
          microfy(amount, decimals),
          address!,
          {
            handleEvent: (event) => {
              writer.withdrawCollateral(symbol, event);
              handleEvent(event);
            },
          },
        );

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectionType],
  );

  const backgroundTxResult = useBackgroundTx<RedeemCollateralTxParams>(
    redeemTx,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}

const displayTx = (txParams: RedeemCollateralTxParams) => {
  const {
    amount,
    collateral: { symbol },
  } = txParams;

  return {
    txKind: TxKind.RedeemCollateral,
    amount: `${formatOutput(amount)} ${symbol}`,
    timestamp: Date.now(),
  };
};
