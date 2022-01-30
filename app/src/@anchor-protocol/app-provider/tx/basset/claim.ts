import { bAssetClaimTx } from '@anchor-protocol/app-fns';
import { useFixedFee, useRefetchQueries } from '@libs/app-provider';
import { HumanAddr } from '@libs/types';
import { useStream } from '@rx-stream/react';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback } from 'react';
import { useAccount } from 'contexts/account';
import { useAnchorWebapp } from '../../contexts/context';
import { ANCHOR_TX_KEY } from '../../env';

export interface BAssetClaimTxParams {
  rewardAddrs: HumanAddr[];
  onTxSucceed?: () => void;
}

export function useBAssetClaimTx() {
  const { availablePost, connected, terraWalletAddress } = useAccount();

  const connectedWallet = useConnectedWallet();

  const { queryClient, txErrorReporter, constants } = useAnchorWebapp();

  const fixedFee = useFixedFee();

  const refetchQueries = useRefetchQueries();

  const stream = useCallback(
    ({ onTxSucceed, rewardAddrs }: BAssetClaimTxParams) => {
      if (
        !connected ||
        !availablePost ||
        !terraWalletAddress ||
        !connectedWallet
      ) {
        throw new Error('Can not post!');
      }

      return bAssetClaimTx({
        // fabricatebAssetClaimRewards
        walletAddr: terraWalletAddress,
        rewardAddrs,
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
          refetchQueries(ANCHOR_TX_KEY.BOND_CLAIM);
        },
      });
    },
    [
      availablePost,
      connected,
      connectedWallet,
      fixedFee,
      terraWalletAddress,
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
