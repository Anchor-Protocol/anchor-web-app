import { uUST } from '@anchor-protocol/types';
import { rewardsAllClaimTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import {
  useRefetchQueries,
  useTerraWebapp,
} from '@terra-money/webapp-provider';
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
        fixedGas: constants.gas.rewardsAllClaim.fixedGas.toString() as uUST,
        gasFee: constants.gas.rewardsAllClaim.gasFee,
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
      constants.gas.rewardsAllClaim.fixedGas,
      constants.gas.rewardsAllClaim.gasFee,
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
