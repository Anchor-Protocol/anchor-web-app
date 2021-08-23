import { COLLATERAL_DENOMS } from '@anchor-protocol/anchor.js';
import { uUST } from '@anchor-protocol/types';
import { bondClaimTx } from '@anchor-protocol/webapp-fns';
import { useStream } from '@rx-stream/react';

import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useRefetchQueries, useTerraWebapp } from '@libs/webapp-provider';
import { useCallback } from 'react';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface BondClaimTxParams {
  onTxSucceed?: () => void;
}

export function useBondClaimTx(rewardDenom: COLLATERAL_DENOMS) {
  const connectedWallet = useConnectedWallet();

  const { addressProvider, constants } = useAnchorWebapp();

  const { mantleEndpoint, mantleFetch, txErrorReporter } = useTerraWebapp();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ onTxSucceed }: BondClaimTxParams) => {
      if (!connectedWallet || !connectedWallet.availablePost) {
        throw new Error('Can not post!');
      }

      return bondClaimTx({
        // fabricatebAssetClaimRewards
        address: connectedWallet.walletAddress,
        rewardDenom,
        // post
        network: connectedWallet.network,
        post: connectedWallet.post,
        fixedGas: constants.fixedGas.toString() as uUST,
        gasFee: constants.gasFee,
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
          refetchQueries(ANCHOR_TX_KEY.BOND_CLAIM);
        },
      });
    },
    [
      connectedWallet,
      rewardDenom,
      constants.fixedGas,
      constants.gasFee,
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
