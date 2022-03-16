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
import { TwoWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { ContractReceipt } from '@ethersproject/contracts';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { formatOutput, microfy } from '@anchor-protocol/formatter';
import { TxEvent } from './useTx';
import { bAsset, NoMicro } from '@anchor-protocol/types';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type RedeemCollateralTxResult = TwoWayTxResponse<ContractReceipt> | null;
type RedeemCollateralTxRender = TxResultRendering<RedeemCollateralTxResult>;

export interface RedeemCollateralTxParams {
  collateralContractEvm: string;
  collateralContractTerra: string;
  amount: bAsset & NoMicro;
  tokenDisplay?: CW20TokenDisplayInfo;
}

export function useRedeemCollateralTx():
  | BackgroundTxResult<RedeemCollateralTxParams, RedeemCollateralTxResult>
  | undefined {
  const {
    address,
    connection,
    connectType,
    chainId = EvmChainId.ETHEREUM_ROPSTEN,
  } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const redeemTx = useCallback(
    async (
      txParams: RedeemCollateralTxParams,
      renderTxResults: Subject<RedeemCollateralTxRender>,
      txEvents: Subject<TxEvent<RedeemCollateralTxParams>>,
    ) => {
      const { collateralContractTerra, amount, tokenDisplay } = txParams;

      const symbol = tokenDisplay?.symbol ?? 'Collateral';
      const decimals = tokenDisplay?.decimals ?? 6;

      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId,
        connectType,
      );
      writer.withdrawCollateral(symbol);
      writer.timer.start();

      try {
        const result = await xAnchor.unlockCollateral(
          { contract: collateralContractTerra },
          microfy(amount, decimals),
          address!,
          TX_GAS_LIMIT,
          (event) => {
            writer.withdrawCollateral(symbol, event);
            txEvents.next({ event, txParams });
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.RedeemCollateral));

        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [xAnchor, address, connectType, chainId, refetchQueries],
  );

  const persistedTxResult = useBackgroundTx<
    RedeemCollateralTxParams,
    RedeemCollateralTxResult
  >(
    redeemTx,
    (resp) => resp.tx,
    null,
    (txParams) => {
      const { amount, tokenDisplay } = txParams;

      const symbol = tokenDisplay?.symbol ?? 'UST';

      return {
        txKind: TxKind.RedeemCollateral,
        amount: `${formatOutput(amount)} ${symbol}`,
        timestamp: Date.now(),
      };
    },
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
