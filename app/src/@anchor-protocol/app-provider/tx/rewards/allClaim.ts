import { rewardsAllClaimTx } from '@anchor-protocol/app-fns';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface RewardsAllClaimTxParams {
  claimUstBorrow: boolean;
  claimAncUstLp: boolean;
  onTxSucceed?: () => void;
}

export function useRewardsAllClaimTx() {
  const { availablePost, connected } = useAccount();

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
      if (!availablePost || !connected || !connectedWallet) {
        throw new Error('Can not post!');
      }

      return rewardsAllClaimTx({
        walletAddr: connectedWallet.walletAddress,
        lpTokenAddr: contractAddress.cw20.AncUstLP,
        marketAddr: contractAddress.moneyMarket.market,
        generatorAddr: contractAddress.astroport.generator,
        claimUstBorrow,
        claimAncUstLp,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: fixedFee,
        gasFee: constants.astroportGasWanted,
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
      availablePost,
      connected,
      connectedWallet,
      contractAddress.cw20.AncUstLP,
      contractAddress.moneyMarket.market,
      contractAddress.astroport.generator,
      fixedFee,
      constants.astroportGasWanted,
      constants.gasAdjustment,
      queryClient,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
