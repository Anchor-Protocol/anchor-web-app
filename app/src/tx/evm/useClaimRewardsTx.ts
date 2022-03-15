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
import { ContractReceipt } from 'ethers';
import { BackgroundTxResult, useBackgroundTx } from './useBackgroundTx';
import { TxEvent } from './useTx';
import { OneWayTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { useRefetchQueries } from '@libs/app-provider';
import { EvmTxProgressWriter } from './EvmTxProgressWriter';

type ClaimRewardsTxResult = OneWayTxResponse<ContractReceipt> | null;
type ClaimRewardsTxRender = TxResultRendering<ClaimRewardsTxResult>;

export interface ClaimRewardsTxParams {}

export function useClaimRewardsTx():
  | BackgroundTxResult<ClaimRewardsTxParams, ClaimRewardsTxResult>
  | undefined {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();
  const refetchQueries = useRefetchQueries(EVM_ANCHOR_TX_REFETCH_MAP);

  const claimRewards = useCallback(
    async (
      txParams: ClaimRewardsTxParams,
      renderTxResults: Subject<ClaimRewardsTxRender>,
      txEvents: Subject<TxEvent<ClaimRewardsTxParams>>,
    ) => {
      const writer = new EvmTxProgressWriter(
        renderTxResults,
        chainId!,
        connectType,
      );
      writer.claimRewards();
      writer.timer.start();

      try {
        const result = await xAnchor.claimRewards(
          address!,
          TX_GAS_LIMIT,
          (event) => {
            writer.claimRewards(event);
            txEvents.next({ event, txParams });
          },
        );

        refetchQueries(refetchQueryByTxKind(TxKind.ClaimRewards));
        return result;
      } finally {
        writer.timer.stop();
      }
    },
    [address, connectType, xAnchor, chainId, refetchQueries],
  );

  const persistedTxResult = useBackgroundTx<
    ClaimRewardsTxParams,
    ClaimRewardsTxResult
  >(
    claimRewards,
    (resp) => resp.tx,
    null,
    () => ({ txKind: TxKind.ClaimRewards, timestamp: Date.now() }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
