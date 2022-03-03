import { StreamReturn } from '@rx-stream/react';
import { useEvmCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';
import { ContractReceipt } from 'ethers';
import { CrossChainTxResponse } from '@anchor-protocol/crossanchor-sdk';
import { useRedeemableTx } from './useRedeemableTx';
import { TxEventHandler } from './useTx';

type TxResult = CrossChainTxResponse<ContractReceipt> | null;
type TxRender = TxResultRendering<TxResult>;

export interface ClaimRewardsTxProps {}

export function useClaimRewardsTx():
  | StreamReturn<ClaimRewardsTxProps, TxResultRendering>
  | [null, null] {
  const { address, connection, connectType, chainId } = useEvmWallet();
  const xAnchor = useEvmCrossAnchorSdk();

  const claimRewards = useCallback(
    (
      txParams: ClaimRewardsTxProps,
      renderTxResults: Subject<TxRender>,
      handleEvent: TxEventHandler<ClaimRewardsTxProps>,
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

  const claimRewardsStream = useRedeemableTx(
    claimRewards,
    (resp) => resp.tx,
    null,
    () => ({ action: 'claimRewards' }),
  );

  return chainId && connection && address ? claimRewardsStream : [null, null];
}
