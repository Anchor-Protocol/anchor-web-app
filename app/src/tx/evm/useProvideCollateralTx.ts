import { useEvmSdk } from 'crossanchor';
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

export interface ProvideCollateralTxParams {
  collateral: WhitelistCollateral;
  amount: bAsset & NoMicro;
  erc20Decimals: number;
}

export function useProvideCollateralTx():
  | BackgroundTxResult<ProvideCollateralTxParams>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmSdk();
  const renderTxResultsRef =
    useRef<Subject<TxResultRendering<ContractReceipt | null>>>();

  const provideTx = useCallback(
    async (
      txParams: ProvideCollateralTxParams,
      handleEvent: CrossChainEventHandler<ContractReceipt>,
    ) => {
      const {
        collateral: { bridgedAddress, symbol },
        amount,
        erc20Decimals,
      } = txParams;

      const writer = new EvmTxProgressWriter(
        renderTxResultsRef.current!,
        connectionType,
      );
      writer.approveCollateral(symbol);
      writer.timer.start();

      try {
        await xAnchor.approveLimit(
          address!,
          { contract: bridgedAddress! },
          microfy(amount, erc20Decimals),
        );

        writer.provideCollateral(symbol);
        writer.timer.reset();

        const response = await xAnchor.lockCollateral(
          address!,
          { contract: bridgedAddress! },
          microfy(amount, erc20Decimals),
          {
            handleEvent: (event) => {
              writer.provideCollateral(symbol, event);
              handleEvent(event);
            },
          },
        );

        return response;
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectionType],
  );

  const backgroundTxResult = useBackgroundTx<ProvideCollateralTxParams>(
    provideTx,
    displayTx,
  );

  renderTxResultsRef.current = backgroundTxResult?.renderTxResults;

  return address ? backgroundTxResult : undefined;
}

const displayTx = (txParams: ProvideCollateralTxParams) => {
  const {
    amount,
    collateral: { symbol },
  } = txParams;

  return {
    txKind: TxKind.ProvideCollateral,
    amount: `${formatOutput(amount)} ${symbol}`,
    timestamp: Date.now(),
  };
};
