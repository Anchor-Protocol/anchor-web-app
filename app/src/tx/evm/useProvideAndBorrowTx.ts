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
import {
  formatOutput,
  microfy,
  useFormatters,
} from '@anchor-protocol/formatter';
import { TxEvent } from './useTx';
import { bAsset, NoMicro } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type ProvideAndBorrowTxResult = OneWayTxResponse<ContractReceipt> | null;
type ProvideAndBorrowTxRender = TxResultRendering<ProvideAndBorrowTxResult>;

export interface ProvideAndBorrowTxParams {
  collateralContract: string;
  collateralAmount: bAsset & NoMicro;
  erc20Decimals: number;
  tokenDisplay?: CW20TokenDisplayInfo;
  borrowAmount: string;
}

export function useProvideAndBorrowTx():
  | BackgroundTxResult<ProvideAndBorrowTxParams, ProvideAndBorrowTxResult>
  | undefined {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);
  const { ust } = useFormatters();

  const provideTx = useCallback(
    async (
      txParams: ProvideAndBorrowTxParams,
      renderTxResults: Subject<ProvideAndBorrowTxRender>,
      txEvents: Subject<TxEvent<ProvideAndBorrowTxParams>>,
    ) => {
      const {
        collateralContract,
        collateralAmount,
        tokenDisplay,
        erc20Decimals,
      } = txParams;

      const borrowAmount = ust
        .microfy(ust.formatInput(txParams.borrowAmount))
        .toString();

      const collateralSymbol = tokenDisplay?.symbol ?? 'Collateral';

      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId,
        connectType,
      );

      writer.approveCollateral(collateralSymbol);
      writer.timer.start();

      try {
        await xAnchor.approveLimit(
          { contract: collateralContract },
          microfy(collateralAmount, erc20Decimals),
          address!,
          TX_GAS_LIMIT,
          (event) => {
            txEvents.next({ event, txParams });
          },
        );

        writer.approveUST();

        await xAnchor.approveLimit(
          { token: 'ust' },
          borrowAmount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            txEvents.next({ event, txParams });
          },
        );

        writer.provideAndBorrow(collateralSymbol);
        writer.timer.reset();

        const response = await xAnchor.lockAndBorrow(
          { contract: collateralContract },
          microfy(collateralAmount, erc20Decimals),
          borrowAmount,
          address!,
          TX_GAS_LIMIT,
          (event) => {
            writer.provideAndBorrow(collateralSymbol, event);
            txEvents.next({ event, txParams });
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.ProvideAndBorrow));

        return response;
      } catch (err) {
        console.log(err);
        throw err;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectType, chainId, refetchQueries, ust],
  );

  const persistedTxResult = useBackgroundTx<
    ProvideAndBorrowTxParams,
    ProvideAndBorrowTxResult
  >(
    provideTx,
    (resp) => resp.tx,
    null,
    (txParams) => {
      const { borrowAmount, collateralAmount, tokenDisplay } = txParams;

      const collateralSymbol = tokenDisplay?.symbol ?? 'UST';

      return {
        txKind: TxKind.ProvideAndBorrow,
        amount: `${formatOutput(borrowAmount)} UST (+${formatOutput(
          collateralAmount,
        )} ${collateralSymbol})`,
        timestamp: Date.now(),
      };
    },
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
