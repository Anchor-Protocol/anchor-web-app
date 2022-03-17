import { useEvmCrossAnchorSdk } from 'crossanchor';
import { EvmChainId, useEvmWallet } from '@libs/evm-wallet';
import { CW20TokenDisplayInfo, TxResultRendering } from '@libs/app-fns';
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

type ProvideCollateralTxResult = OneWayTxResponse<ContractReceipt> | null;
type ProvideCollateralTxRender = TxResultRendering<ProvideCollateralTxResult>;

export interface ProvideCollateralTxParams {
  collateralContract: string;
  amount: bAsset & NoMicro;
  erc20Decimals: number;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export function useProvideCollateralTx():
  | BackgroundTxResult<ProvideCollateralTxParams, ProvideCollateralTxResult>
  | undefined {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const provideTx = useCallback(
    async (
      txParams: ProvideCollateralTxParams,
      renderTxResults: Subject<ProvideCollateralTxRender>,
      txEvents: Subject<TxEvent<ProvideCollateralTxParams>>,
    ) => {
      const { collateralContract, amount, tokenDisplay, erc20Decimals } =
        txParams;

      const symbol = tokenDisplay?.symbol ?? 'Collateral';

      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId,
        connectType,
      );
      writer.approveCollateral(symbol);
      writer.timer.start();

      try {
        await xAnchor.approveLimit(
          { contract: collateralContract },
          microfy(amount, erc20Decimals),
          address!,
          TX_GAS_LIMIT,
          (event) => {
            txEvents.next({ event, txParams });
          },
        );

        writer.provideCollateral(symbol);
        writer.timer.reset();

        const response = await xAnchor.lockCollateral(
          { contract: collateralContract },
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
    [xAnchor, address, connectType, chainId, refetchQueries],
  );

  const persistedTxResult = useBackgroundTx<
    ProvideCollateralTxParams,
    ProvideCollateralTxResult
  >(
    provideTx,
    (resp) => resp.tx,
    null,
    (txParams) => {
      const { amount, tokenDisplay } = txParams;

      const symbol = tokenDisplay?.symbol ?? 'UST';

      return {
        txKind: TxKind.ProvideCollateral,
        amount: `${formatOutput(amount)} ${symbol}`,
        timestamp: Date.now(),
      };
    },
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
