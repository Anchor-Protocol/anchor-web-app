import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
  TX_GAS_LIMIT,
} from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { OneWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { formatOutput, microfy } from '@anchor-protocol/formatter';
import { TxEvent } from './useTx';
import { bAsset, NoMicro } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { WhitelistCollateral } from 'queries';

type ProvideCollateralTxResult = OneWayTxResponse<ContractReceipt> | null;
type ProvideCollateralTxRender = TxResultRendering<ProvideCollateralTxResult>;

export interface ProvideCollateralTxParams {
  collateral: WhitelistCollateral;
  amount: bAsset & NoMicro;
  erc20Decimals: number;
}

export function useProvideCollateralTx():
  | BackgroundTxResult<ProvideCollateralTxParams, ProvideCollateralTxResult>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const provideTx = useCallback(
    async (
      txParams: ProvideCollateralTxParams,
      renderTxResults: Subject<ProvideCollateralTxRender>,
      txEvents: Subject<TxEvent<ProvideCollateralTxParams>>,
    ) => {
      const {
        collateral: { bridgedAddress, symbol },
        amount,
        erc20Decimals,
      } = txParams;

      const writer = new EvmTxProgressWriter(renderTxResults, connectionType);
      writer.approveCollateral(symbol);
      writer.timer.start();

      try {
        await xAnchor.approveLimit(
          { contract: bridgedAddress! },
          microfy(amount, erc20Decimals),
          address!,
          TX_GAS_LIMIT,
        );

        writer.provideCollateral(symbol);
        writer.timer.reset();

        const response = await xAnchor.lockCollateral(
          { contract: bridgedAddress! },
          microfy(amount, erc20Decimals),
          address!,
          TX_GAS_LIMIT,
          (event) => {
            writer.provideCollateral(symbol, event);
            txEvents.next({ event, txParams });
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.ProvideCollateral));

        return response;
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectionType, refetchQueries],
  );

  const persistedTxResult = useBackgroundTx<
    ProvideCollateralTxParams,
    ProvideCollateralTxResult
  >(provideTx, parseTx, null, displayTx);

  return address ? persistedTxResult : undefined;
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

const parseTx = (resp: NonNullable<ProvideCollateralTxResult>) => resp.tx;
