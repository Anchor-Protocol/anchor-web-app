import { useEvmSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import {
  EVM_ANCHOR_TX_REFETCH_MAP,
  refetchQueryByTxKind,
  TxKind,
} from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from '@ethersproject/contracts';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { formatOutput, microfy } from '@anchor-protocol/formatter';
import { TxEvent } from './useTx';
import { bAsset, NoMicro } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';
import { WhitelistCollateral } from 'queries';

type RedeemCollateralTxResult = ContractReceipt | null;
type RedeemCollateralTxRender = TxResultRendering<RedeemCollateralTxResult>;

export interface RedeemCollateralTxParams {
  collateral: WhitelistCollateral;
  amount: bAsset & NoMicro;
}

export function useRedeemCollateralTx():
  | BackgroundTxResult<RedeemCollateralTxParams, RedeemCollateralTxResult>
  | undefined {
  const { address, connectionType } = useEvmWallet();
  const xAnchor = useEvmSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const redeemTx = useCallback(
    async (
      txParams: RedeemCollateralTxParams,
      renderTxResults: Subject<RedeemCollateralTxRender>,
      txEvents: Subject<TxEvent<RedeemCollateralTxParams>>,
    ) => {
      const {
        collateral: { collateral_token, symbol, decimals },
        amount,
      } = txParams;

      const writer = new EvmTxProgressWriter(renderTxResults, connectionType);
      writer.withdrawCollateral(symbol);
      writer.timer.start();

      try {
        const result = await xAnchor.unlockCollateral(
          address!,
          { contract: collateral_token },
          microfy(amount, decimals),
          {
            handleEvent: (event) => {
              writer.withdrawCollateral(symbol, event);
              txEvents.next({ event, txParams });
            },
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.RedeemCollateral));

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectionType, refetchQueries],
  );

  const persistedTxResult = useBackgroundTx<
    RedeemCollateralTxParams,
    RedeemCollateralTxResult
  >(redeemTx, parseTx, null, displayTx);

  return address ? persistedTxResult : undefined;
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

const parseTx = (resp: NonNullable<RedeemCollateralTxResult>) => resp;
