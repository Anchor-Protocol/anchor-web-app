import { StreamReturn } from '@rx-stream/react';
import { useEthCrossAnchorSdk } from 'crossanchor';
import { useEvmWallet } from '@libs/evm-wallet';
import { TxResultRendering } from '@libs/app-fns';
import { useTx } from './useTx';
import { txResult, TX_GAS_LIMIT } from './utils';
import { Subject } from 'rxjs';
import { useCallback } from 'react';

export interface ClaimRewardsTxProps {}

export function useClaimRewardsTx():
  | StreamReturn<ClaimRewardsTxProps, TxResultRendering>
  | [null, null] {
  const { provider, address, connection, connectType } = useEvmWallet();
  const ethSdk = useEthCrossAnchorSdk('testnet', provider);

  const claimRewards = useCallback(
    (
      _txParams: ClaimRewardsTxProps,
      renderTxResults: Subject<TxResultRendering>,
    ) => {
      return ethSdk.claimRewards(address!, TX_GAS_LIMIT, (event) => {
        console.log(event, 'eventEmitted');

        renderTxResults.next(txResult(event, connectType));
      });
    },
    [address, connectType, ethSdk],
  );

  const claimRewardsStream = useTx(claimRewards);

  return connection && address ? claimRewardsStream : [null, null];
}
