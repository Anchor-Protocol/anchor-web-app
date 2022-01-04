import { rewardsAllClaimTx } from '@anchor-protocol/app-fns';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface RewardsAllClaimTxParams {
  claimUstBorrow: boolean;
  claimAncUstLp: boolean;
  onTxSucceed?: () => void;
}

export function useRewardsAllClaimTx() {
  const connectedWallet = useConnectedWallet();

  const { contractAddress, constants, queryClient, txErrorReporter } =
    useAnchorWebapp();

  const refetchQueries = useRefetchQueries();

  const fixedFee = useFixedFee();

  const stream = useCallback(
    ({
      claimAncUstLp,
      claimUstBorrow,
      onTxSucceed,
    }: RewardsAllClaimTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return rewardsAllClaimTx({
        walletAddr: connectedWallet.walletAddress,
        stakingAddr: contractAddress.anchorToken.staking,
        marketAddr: contractAddress.moneyMarket.market,
        claimUstBorrow,
        claimAncUstLp,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        // query
        queryClient,
        // error
        txErrorReporter,
        // side effect
        onTxSucceed: () => {
          onTxSucceed?.();
          refetchQueries(ANCHOR_TX_KEY.REWARDS_ALL_CLAIM);
        },
      });
    },
    [
      connectedWallet,
      contractAddress.anchorToken.staking,
      contractAddress.moneyMarket.market,
      fixedFee,
      constants.gasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
