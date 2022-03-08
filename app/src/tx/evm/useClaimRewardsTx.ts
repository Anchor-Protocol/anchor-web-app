import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { PersistedTxResult, usePersistedTx } from './usePersistedTx';
import { TxEventHandler } from './useTx';
import { OneWayTxResponse } from '@anchor-protocol/crossanchor-sdk';

type ClaimRewardsTxResult = OneWayTxResponse<ContractReceipt> | null;
type ClaimRewardsTxRender = TxResultRendering<ClaimRewardsTxResult>;

export interface ClaimRewardsTxParams {}

export function useClaimRewardsTx():
  | PersistedTxResult<ClaimRewardsTxParams, ClaimRewardsTxResult>
  | undefined {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();

  const claimRewards = useCallback(
    (
      txParams: ClaimRewardsTxParams,
      renderTxResults: Subject<ClaimRewardsTxRender>,
      handleEvent: TxEventHandler<ClaimRewardsTxParams>,
    ) => {
      return xAnchor.claimRewards(address!, TX_GAS_LIMIT, (event) => {
        console.log(event, 'eventEmitted');

        renderTxResults.next(
          txResult(event, connectType, chainId!, 'claim rewards'),
        );
        handleEvent(event, txParams);
      });
    },
    [address, connectType, xAnchor, chainId],
  );

  const persistedTxResult = usePersistedTx<
    ClaimRewardsTxParams,
    ClaimRewardsTxResult
  >(
    claimRewards,
    (resp) => resp.tx,
    null,
    () => ({ action: 'claimRewards', timestamp: Date.now() }),
  );

  return chainId && connection && address ? persistedTxResult : undefined;
}
