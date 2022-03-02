import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import {
  CrossChainEventHandler,
  CrossChainTxResponse,
} from '@anchor-protocol/crossanchor-sdk';
import { useRedeemableTx } from './useRedeemableTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface ClaimRewardsTxProps {}

export function useClaimRewardsTx():
  | StreamReturn<ClaimRewardsTxProps, TxResultRendering>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const evmSdk = useEvmCrossAnchorSdk();

  const claimRewards = useCallback(
    (
      _txParams: ClaimRewardsTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: CrossChainEventHandler,
    ) => {
      return evmSdk.claimRewards(address!, TX_GAS_LIMIT, (event) => {
        console.log(event, 'eventEmitted');

        renderTxResults.next(
          txResult(event, connectType, chainId!, 'claim rewards'),
        );
        handleEvent(event);
      });
    },
    [address, connectType, evmSdk, chainId],
  );

  const claimRewardsStream = useRedeemableTx(
    claimRewards,
    (resp) => resp.tx,
    null,
    () => ({ action: 'claimRewards' }),
  );

  return chainId && connection && address ? claimRewardsStream : [null, null];
}
