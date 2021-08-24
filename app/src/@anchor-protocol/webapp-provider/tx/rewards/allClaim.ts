import { rewardsAllClaimTx } from '@anchor-protocol/webapp-fns';
import { u, UST } from '@libs/types';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
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

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

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
        address: connectedWallet.walletAddress,
        claimUstBorrow,
        claimAncUstLp,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: constants.fixedGas.toString() as u<UST>,
        gasFee: constants.gasWanted,
        gasAdjustment: constants.gasAdjustment,
        addressProvider,
        // query
        mantleEndpoint,
        mantleFetch,
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
      constants.fixedGas,
      constants.gasWanted,
      constants.gasAdjustment,
      addressProvider,
      mantleEndpoint,
      mantleFetch,
      txErrorReporter,
      refetchQueries,
    ],
  );

  const streamReturn = useStream(stream);

  return connectedWallet ? streamReturn : [null, null];
}
